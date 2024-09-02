import postmanToOpenApi from 'postman-to-openapi';

export default async function postmanToSwagger(input: any, output: string) {
  try {
    await postmanToOpenApi(input, output, { defaultTag: 'General' });
    console.log(`File save to this location ${output}`);
  } catch (error) {
    console.error(`Error in postmanToSwagger: ${error}`);
    throw error;
  }
}
