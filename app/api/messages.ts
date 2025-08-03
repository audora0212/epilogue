// pages/api/messages.ts
import { promises as fs } from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

type Message = {
  nickname: string;
  content: string;
  date: string;
};

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readData(): Promise<Message[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Message[];
}

async function writeData(data: Message[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const list = await readData();
    return res.status(200).json(list);
  }

  if (req.method === "POST") {
    const { nickname, content } = req.body as { nickname?: string; content?: string };
    if (!nickname || !content) {
      return res.status(400).json({ error: "nickname, content both required" });
    }

    const list = await readData();
    const entry: Message = {
      nickname,
      content,
      date: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    list.unshift(entry);
    await writeData(list);
    return res.status(201).json(entry);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end();
}
