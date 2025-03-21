import { createTool } from "@mastra/core";
import z from "zod";

export const webSearchTool = createTool({
  id: "webSearchTool",
  description: "000-0000形式で入力された郵便番号の住所を検索して提供します。",
  inputSchema: z.object({
    zipCodes: z.array(
      z
        .string()
        .regex(/^\d{3}-\d{4}$/)
        .describe("郵便番号")
    ),
  }),
  outputSchema: z.object({
    results: z.object({
      addressList: z.array(z.string()),
    }),
  }),
  execute: async ({ context }) => {
    console.log("webSearchTool context", context);
    const addresses: string[] = [];
    for (const zipCode of context.zipCodes) {
      const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log("response", response);
          const data = await response.json();
          if (data.results && Array.isArray(data.results)) {
            data.results.forEach((result: any) => {
              addresses.push(
                `${result.address1}${result.address2}${result.address3}`
              );
            });
          }
        } else {
          console.error(
            `Failed to fetch for ${zipCode}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error(`Error fetching ${zipCode}:`, error);
      }
    }
    return {
      results: {
        addressList: addresses,
      },
    };
  },
});
