import { d as defineEventHandler, u as useRuntimeConfig, c as createError } from '../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';

const skills_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const { data, error } = await client.from("skills").select("*").order("category", { ascending: true }).order("level", { ascending: false });
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch skills"
      });
    }
    const groupedSkills = (data || []).reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
    return {
      success: true,
      data: groupedSkills
    };
  } catch (error) {
    console.error("Skills API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching skills"
    });
  }
});

export { skills_get as default };
//# sourceMappingURL=skills.get.mjs.map
