import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should be able get a statement operation", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "user",
      email: "user@example.com",
      password: "1234",
    });

    const statement = await statementRepositoryInMemory.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit of 100",
    });

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(getStatement).toHaveProperty("id");
  });

  it("should be not able get a statement operation if user not found", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user.id",
        statement_id: "statement.id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should be not able get a statement operation if user not found", () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        name: "user",
        email: "user@example.com",
        password: "1234",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "statement.id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
