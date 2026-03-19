import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTotalReactions(candidate: {
  like: number
  love: number
  care: number
  haha: number
  wow: number
  sad: number
  angry: number
}) {
  return (
    candidate.like +
    candidate.love +
    candidate.care +
    candidate.haha +
    candidate.wow +
    candidate.sad +
    candidate.angry
  )
}
