import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

    it("should be able to get balance", async () => {
      const user = await usersRepositoryInMemory.create({
        name: "teste",
        email: "teste@teste.com",
        password: "1234",
      });

      const result = await getBalanceUseCase.execute({ user_id: user.id });

      expect(result).toHaveProperty("balance");
      expect(result.balance).toBe(0);
    });

    it("should not be able to get balance if user not found", () => {
      expect(async () => {
        await getBalanceUseCase.execute({
          user_id: "1234",
        });
      }).rejects.toBeInstanceOf(GetBalanceError);
    });
  });
