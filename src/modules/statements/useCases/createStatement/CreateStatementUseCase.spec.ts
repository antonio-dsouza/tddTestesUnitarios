import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
describe("Create Statemente", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "user",
      email: "user@example.com",
      password: "1234",
    });

    const result = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit of 100",
    });

    expect(result).toHaveProperty("id");
  });

  it("should be mnot able to create a new statement if user not found", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalidId",
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "Withdrawn of 150",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be not able to create a new statement if have insufficient funds", async () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "user",
        email: "user@example.com",
        password: "1234",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 150,
        description: "Withdrawn of 150",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
