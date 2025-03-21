import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { webSearchTool } from "../tools/webSearchTool";
import { AgentNetwork } from "@mastra/core/network";

export const zipCodeCandidateListAgent = new Agent({
  name: "zipCodeCandidateListAgent",
  instructions: `
    あなたはユーザーからの情報をもとに、住所を候補として提示するエージェントです。

    ユーザーからは目印となる建物名や、不完全な住所が与えられます。

    あなたの主な役割は、ユーザーからの情報をもとに、郵便番号の候補として提示することです。応答する際には、以下の点に注意してください。
    - 郵便番号の候補を5つまで提示してください。
    - 郵便番号の候補は、000-0000のように数字とハイフンみので5つまで提示してください。
  `,
  model: google("gemini-1.5-flash-latest"),
});

export const webSearchAgent = new Agent({
  name: "webSearchAgent",
  instructions: `
    あなたは郵便番号を検索して住所をユーザーに候補を提示するエージェントです。

    あなたの主な役割は、ユーザーからの情報をもとに、住所を候補として提示することです。応答する際には、以下の点に注意してください。
    - 住所の候補を5つまで提示してください。
    - 住所の候補は、郵便番号から取得したものを使用してください。

    郵便番号から住所検索するには、webSearchTool を使用します。
  `,
  model: google("gemini-1.5-flash-latest"),
  tools: { webSearchTool },
});

export const addressAgentNetwork = new AgentNetwork({
  name: "郵便番号検索エージェント",
  instructions: `
      あなたは郵便番号を検索して住所をユーザーに候補を提示するエージェントです。

      あなたの主な役割は、ユーザーからの情報をもとに、住所を候補として提示することです。応答する際には、以下の点に注意してください。
      - ユーザーからの情報は、住所とは限りません。目印となる建物や施設の名前なども含まれる可能性があります。
      - 住所の候補を5つまで提示してください。

      以下の形式で結果を出力してください。
      候補1: 〒100-0001 東京都千代田区千代田1-1-1
      候補2: 〒100-0002 東京都千代田区千代田1-1-2
      候補3: 〒100-0003 東京都千代田区千代田1-1-3

      ユーザーの情報から候補となる郵便番号を取得するには、zipCodeCandidateListAgentを使用します。郵便番号から完全な住所を取得するには、webSearchAgentを使用します。
  `,
  model: google("gemini-1.5-flash-latest"),
  agents: [zipCodeCandidateListAgent, webSearchAgent],
});
