import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useBadmintonStore } from '@/store/useBadmintonStore'
import { Loader2 } from 'lucide-react'
import { generateTournamentName } from '@/hooks/generateTournamentName'

export type MatchType = 'singles' | 'doubles'

interface TournamentFormatSelectorProps {
  onNext: () => void
}

const MATCH_TYPES = [
  { type: 'singles', label: 'Singles ', color: 'from-blue-400 to-blue-600' },
  { type: 'doubles', label: 'Doubles ', color: 'from-lime-400 to-green-500' },
]

export default function TournamentFormatSelector({
  onNext,
}: TournamentFormatSelectorProps) {
  const { addTournament, loading, error } = useBadmintonStore()
  const newName = generateTournamentName()

  const [inputData, setInputData] = useState<{
    name: string
    match_type: MatchType | null
    max_game_set: number
    points_per_game: number
  }>({
    name: newName,
    match_type: 'singles',
    max_game_set: 1,
    points_per_game: 21,
  })

  const handleNext = async () => {
    await addTournament({
      name: inputData.name,
      tournament_type: 'round-robin',
      match_type: inputData.match_type ?? 'singles',
      max_game_set: inputData.max_game_set,
      points_per_game: inputData.points_per_game,
    })
    onNext()
  }

  return (
    <>
      {error ? (
        <div>
          There is an Error to Add Tournament , Try again after sometime
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full ">
          <h2 className="text-xl font-bold mb-2 text-white">
            Create Tournament 🏸
          </h2>
          <label className="mb-2 text-sm font-medium text-gray-200">
            Tournament Name
          </label>
          <input
            className="w-full rounded-lg px-3 py-2 bg-black/40 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-400 mb-4"
            placeholder="Enter tournament name"
            value={inputData.name}
            onChange={(e) => {
              setInputData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }}
          />
          <p className="">Match Format</p>
          <div className="flex flex-row gap-6 w-full justify-center">
            {MATCH_TYPES.map((m) => (
              <motion.div
                key={m.type}
                onClick={() =>
                  setInputData((prev) => ({
                    ...prev,
                    match_type: m.type as MatchType,
                  }))
                }
                // onClick={() => setLocalMatchType(m.type as MatchType)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 flex items-center justify-center w-[80px] rounded-xl shadow px-2 py-2 bg-gradient-to-tr ${
                  m.color
                } text-white font-semibold text-base transition-all duration-300  ${
                  inputData.match_type === m.type
                    ? 'border-white ring-4 '
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                aria-pressed={inputData.match_type === m.type}
              >
                {m.label}
              </motion.div>
            ))}
          </div>
          <div className="space-y-2 mt-4">
            <p>Setting</p>
            <div className="flex items-center justify-between w-full gap-4">
              <p>Max Game (sets)</p>
              <Select
                defaultValue={inputData.max_game_set.toString()}
                onValueChange={(value) =>
                  setInputData((prev) => ({
                    ...prev,
                    max_game_set: Number(value),
                  }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between w-full gap-4">
              <p>Points per Game</p>
              <Select
                defaultValue={inputData.points_per_game.toString()}
                onValueChange={(value) =>
                  setInputData((prev) => ({
                    ...prev,
                    points_per_game: Number(value),
                  }))
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            className="mt-8 px-10 py-3 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-lime-400 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-transform text-lg disabled:opacity-50"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? <Loader2 size={25} className=" animate-spin" /> : 'Next'}
          </button>
        </div>
      )}
    </>
  )
}
