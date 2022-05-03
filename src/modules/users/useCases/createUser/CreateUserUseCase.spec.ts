import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
      const user = await createUserUseCase.execute({
        name: "teste",
        email: "false@example.com",
        password: "1234",
      });

      expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with an email existent", () =>{
    expect(async () =>{
      await createUserUseCase.execute({
        name: "teste",
        email: "false@example.com",
        password: "1234",
      });

      await createUserUseCase.execute({
        name: "teste",
        email: "false@example.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
});
