import { ActionFunction, json } from '@remix-run/node';
import { prisma } from '~/utils/server/prismaClient';
import { useErrors } from '~/utils/server/useErrors';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { errors, pushErrors, requiredParams } = useErrors();

  switch (intent) {
    case 'check': {
      const id = formData.get('id') as string;
      const name = formData.get('name') as string;
      const avatar = formData.get('avatar') as string;

      requiredParams({
        id,
        name,
        avatar,
      });

      if (errors.length) {
        throw json(
          { errors },
          {
            status: 422,
          },
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            id,
            name,
            avatar,
          },
        });

        return json({ ok: true });
      }

      return json({ ok: true });
    }
  }

  pushErrors('not found');
  throw json(
    { errors },
    {
      status: 404,
    },
  );
};
