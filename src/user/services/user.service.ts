import { User } from "../model/user.model";

class UsersService {
  async createUser(user: Omit<string, any>) {
    return User.create(user);
  }

  async getUserById(id: number) {
    return User.findByPk(id);
  }

  async getAllUsers() {
    return User.findAll();
  }

  async updateUser(id: number, user: User) {
    return User.update(user, { where: { id } });
  }

  async deleteUser(id: number) {
    return User.destroy({ where: { id } });
  }
}

export { UsersService };