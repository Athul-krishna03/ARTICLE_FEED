import { container } from "tsyringe";
import { RepositoryRegistry } from "./repository.register";
import { ServicesRegistery } from "./service.register";
import { AuthController } from "../controllers/authController";
import { UserController } from "../controllers/userController";



export class DependencyInjection {
    static registerAll(): void {
        RepositoryRegistry.registerRepositories();
        ServicesRegistery.registerServices();
    }
}


DependencyInjection.registerAll()
export const authController = container.resolve(AuthController);
export const userController = container.resolve(UserController)