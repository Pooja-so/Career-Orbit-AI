// api folder: Here we build private nad public APIS
// we will build public API for inngest to connect to our application
//  we will be using inngest for fetching Industry insights every week
import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { helloWorld } from "@/lib/inngest/functions";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    helloWorld
  ],
});
