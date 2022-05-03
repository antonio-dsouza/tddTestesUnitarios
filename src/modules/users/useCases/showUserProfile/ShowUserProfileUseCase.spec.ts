import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show an user profile", async () => {
    const user = await usersRepositoryInMemory.create({
        name: "Teste",
        email: "teste@teste.com",
        password: "12345"
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty("id");
  });

  it("should be not able to show an user profile with invalid id", () => {
      expect(async () => {
          const userProfile = await showUserProfileUseCase.execute('1234');
      }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});