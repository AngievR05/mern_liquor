import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const bottles = [
  { id: 1, name: 'Whiskey A', type: 'whiskey' },
  { id: 2, name: 'Beer B', type: 'beer' },
  { id: 3, name: 'Wine C', type: 'wine' },
]

export default function GameAuth() {
  const [userSelection, setUserSelection] = useState({})
  const navigate = useNavigate()

  const handleSubmit = () => {
    const isCorrect = bottles.every(b => userSelection[b.id] === b.type)
    navigate(isCorrect ? '/success' : '/failure')
  }

  return (
    <div className="min-h-screen bg-soft p-4 text-dark grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Sort These Spirits</h2>
        <div className="grid grid-cols-3 gap-2">
          {['beer', 'wine', 'whiskey'].map(shelf => (
            <div key={shelf} className="p-4 bg-white border rounded">
              <h3 className="font-semibold capitalize">{shelf}</h3>
              <div className="min-h-[80px] border mt-2" onDrop={e => {
                const bottleId = e.dataTransfer.getData('bottle')
                setUserSelection(prev => ({ ...prev, [bottleId]: shelf }))
              }} onDragOver={e => e.preventDefault()} />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="font-semibold">Bottles</h4>
          <div className="flex gap-2 mt-2">
            {bottles.map(b => (
              <div key={b.id} className="p-2 bg-secondary rounded cursor-move" draggable onDragStart={e => e.dataTransfer.setData('bottle', b.id)}>{b.name}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="mb-4">Drag each bottle to the correct shelf. When you're done, click Submit.</p>
        <button onClick={handleSubmit} className="bg-accent text-dark font-bold px-4 py-2 rounded mb-2">Submit</button>
        <button onClick={() => setUserSelection({})} className="block underline text-sm text-primary">Reset Puzzle</button>
      </div>
    </div>
  )
}