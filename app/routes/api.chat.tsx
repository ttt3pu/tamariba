import { ActionFunction, LoaderFunction, json } from '@remix-run/node';
import { sanitize } from '~/utils/server/domplify';
import { prisma } from '~/utils/server/prismaClient';
import { useErrors } from '~/utils/server/useErrors';

export const loader: LoaderFunction = async () => {
  const chatLogs = await prisma.chatLog.findMany({
    take: 50,
    orderBy: {
      id: 'desc',
    },
    include: {
      user: true,
    },
  });

  return json(chatLogs.reverse());
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { errors, pushErrors, requiredParams } = useErrors();

  switch (intent) {
    case 'new': {
      const userId = formData.get('user_id') as string;
      const content = formData.get('content') as string;

      requiredParams({
        userId,
        content,
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
          id: userId,
        },
      });

      if (!user) {
        pushErrors('Invalid user id.');
        throw json(
          { errors },
          {
            status: 422,
          },
        );
      }

      await prisma.chatLog.create({
        data: {
          user_id: userId,
          content: sanitize(content),
        },
      });
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
