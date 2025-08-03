// app/api/messages/route.ts

import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json')

/** data/messages.json 파일과 폴더가 없으면 생성 */
async function ensureFile() {
  const dir = path.dirname(messagesFilePath)
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
  try {
    await fs.access(messagesFilePath)
  } catch {
    await fs.writeFile(messagesFilePath, '[]', 'utf-8')
  }
}

export async function GET() {
  try {
    await ensureFile()
    const raw = await fs.readFile(messagesFilePath, 'utf-8')
    // 빈 문자열·공백만 있으면 빈 배열로
    const messages = raw.trim() ? JSON.parse(raw) : []
    return NextResponse.json(messages)
  } catch (err) {
    console.error('GET /api/messages error:', err)
    // 에러 발생해도 빈 배열 응답
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureFile()
    const { nickname, message, date } = await request.json()

    // 기존 데이터 읽기
    const raw = await fs.readFile(messagesFilePath, 'utf-8')
    let messages: Array<any>
    try {
      messages = raw.trim() ? JSON.parse(raw) : []
    } catch {
      messages = []
    }

    // 새 항목 추가
    const newEntry = {
      id: Date.now(),
      nickname,
      message,
      date,
    }
    messages.push(newEntry)

    // 파일에 덮어쓰기
    await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8')
    return NextResponse.json(messages)
  } catch (err) {
    console.error('POST /api/messages error:', err)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
