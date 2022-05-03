import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    await usersRepositoryInMemory.create({
      name: 'Teste TDD',
      email: 'teste@email.com',
      password: await hash('1234', 8),
    })

    const result = await authenticateUserUseCase.execute({
      email: 'teste@email.com',
      password: '1234',
    });

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
  });

  it("should not be able to authenticate with an non existent user", () =>{
    expect(async () =>{
      await authenticateUserUseCase.execute({
        email: "false@example.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", () =>{
    expect(async () =>{

      const user = await usersRepositoryInMemory.create({
        name: "teste",
        email: "false@example.com",
        password: "1234",
      })

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
