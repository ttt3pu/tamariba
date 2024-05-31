import { ActionFunction, json } from '@remix-run/node';
import { useErrors } from '~/utils/server/useErrors';
import { parseString } from 'xml2js';
import { prisma } from '~/utils/server/prismaClient';
import { string, z } from 'zod';

const bodySchema = z.object({
  intent: z.enum(['new']),
  video_id: z.string(),
  user_id: z.string(),
  platform: z.enum(['nico', 'youtube']),
});

export const action: ActionFunction = async ({ request }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { errors, pushErrors, requiredParams } = useErrors();

  const { success, error, data } = bodySchema.safeParse(Object.fromEntries(await request.formData()));

  if (!success) {
    return json({
      validationMessages: error.flatten().fieldErrors,
    });
  }

  const { intent, video_id, user_id, platform } = data;

  switch (intent) {
    case 'new': {
      switch (platform) {
        case 'youtube': {
          const url = `https://www.youtube.com/watch?v=${video_id}`;
          const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);

          if (response.status !== 200) {
            pushErrors(response.statusText);
            throw json(
              { errors },
              {
                status: response.status,
              },
            );
          }

          if (errors.length) {
            throw json(
              { errors },
              {
                status: 409,
              },
            );
          }

          const videoInfo = await response.json();
          const title = videoInfo.title;

          await prisma.videoLog.create({
            data: {
              title,
              video_id,
              user_id,
              platform: 'youtube',
            },
          });

          return json({ ok: true });
        }
        case 'nico': {
          const response = await fetch(`https://ext.nicovideo.jp/api/getthumbinfo/${video_id}`);

          if (response.status !== 200) {
            pushErrors(response.statusText);
            throw json(
              { errors },
              {
                status: response.status,
              },
            );
          }

          if (errors.length) {
            throw json(
              { errors },
              {
                status: 409,
              },
            );
          }

          let title: string = '';
          parseString(await response.text(), function (_, result) {
            title = result.nicovideo_thumb_response.thumb[0].title[0];
          });

          await prisma.videoLog.create({
            data: {
              title,
              video_id,
              user_id,
              platform: 'nico',
            },
          });

          return json({ ok: true });
        }
        default: {
          pushErrors('Invalid platform.');
          throw json(
            { errors },
            {
              status: 409,
            },
          );
        }
      }
    }
    default: {
      pushErrors('Invalid intent.');
      throw json(
        { errors },
        {
          status: 404,
        },
      );
    }
  }
};
