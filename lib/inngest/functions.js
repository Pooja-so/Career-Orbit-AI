/*
The createFunction method takes three objects as arguments:

1. Configuration: A unique id is required and it is the default name that will be displayed 
on the Inngest dashboard to refer to your function. You can also specify additional 
options such as concurrency, rateLimit, retries, or batchEvents, and others.
2. Trigger: event is the name of the event that triggers your function. 
Alternatively, you can use cron to specify a schedule to trigger this function. Learn more about triggers here.
3. Handler: The function that is called when the event is received. 
The event payload is passed as an argument. Arguments include step to define 
durable steps within your handler and additional arguments include logging helpers and other data.

*/
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
