import { d as defineEventHandler, r as readBody, c as createError, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';

const login_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { password } = body;
  if (!password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Password is required"
    });
  }
  const expectedPassword = config.adminPassword || "admin123";
  if (password === expectedPassword) {
    return {
      success: true,
      token: `Bearer ${password}`
    };
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid password"
    });
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
