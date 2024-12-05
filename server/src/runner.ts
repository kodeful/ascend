import { UserModel, UserRole } from 'api/models/user.model';

export const runner = async () => {
  // Run your functions here while in development

  await UserModel.updateMany(
    {},
    {
      role: UserRole.FACILITATOR,
    },
  );
};
