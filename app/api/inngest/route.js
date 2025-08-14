// api folder: Here we build private and public APIS
// we will build public API for inngest to connect to our application
//  we will be using inngest for fetching Industry insights every week

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/functions";
// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later!. These functions will run in background */
    generateIndustryInsights,
  ],
});
