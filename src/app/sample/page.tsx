"use client"
import { useState, useEffect } from "react"
import axios from "axios"

interface Ability {
    name: string;
    url: string;
}

interface PokemonAbility {
    ability: Ability;
    is_hidden: boolean;
    slot: number;
}

export default function SamplePage() {
const [abilities, setAbilities] = useState<PokemonAbility[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

const getData = async () => {
    try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto")
        setAbilities(response.data.abilities)
    } catch (err) {
        setError('Failed to load Pokemon data')
        console.error('Error fetching data:', err)
    } finally {
        setIsLoading(false)
    }
}

useEffect(() => {
    getData()
}, [])

if (isLoading) {
    return (
        <div className="min-h-screen text-zinc-100 asimovian-regular flex items-center justify-center" style={{
            background: 'radial-gradient(ellipse at center, rgba(25, 25, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)',
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.01) 0%, transparent 50%)'
        }}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading Pokemon abilities...</p>
            </div>
        </div>
    )
}

if (error) {
    return (
        <div className="min-h-screen text-zinc-100 asimovian-regular flex items-center justify-center" style={{
            background: 'radial-gradient(ellipse at center, rgba(25, 25, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)',
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.01) 0%, transparent 50%)'
        }}>
            <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 mx-auto">
                    <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-zinc-300 mb-2">Error Loading Data</h2>
                <p className="text-zinc-400 mb-4">{error}</p>
                <button
                    onClick={getData}
                    className="px-4 py-2 text-black font-medium rounded-lg transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#64FD00' }}
                >
                    Try Again
                </button>
            </div>
        </div>
    )
}

return (
    <div className="min-h-screen text-zinc-100 asimovian-regular" style={{
        background: 'radial-gradient(ellipse at center, rgba(25, 25, 25, 1) 0%, rgba(5, 5, 5, 1) 100%)',
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.01) 0%, transparent 50%)'
    }}>
        {/* Header */}
        <div className="backdrop-blur-md border-b border-zinc-700/50 px-3 sm:px-6 py-3 sm:py-4" style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.03) 0%, rgba(0, 0, 0, 0.5) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
        }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-base font-semibold text-zinc-100">Pokemon Abilities</h1>
                        <p className="text-xs text-zinc-400">Sample API Integration</p>
                    </div>
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm border border-zinc-600/50 text-black rounded-full transition-all duration-300 hover:scale-[1.02]"
                    style={{
                        backgroundColor: '#64FD00',
                        boxShadow: '0 0 15px rgba(100, 253, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <span className="text-xs sm:text-sm">←</span>
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Title Section */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                        <svg className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 mb-2">
                        Dittos Abilities
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto px-4 sm:px-0">
                        Explore the abilities of the transform Pokemon from the Pokemon API.
                    </p>
                </div>

                {/* Abilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {abilities.map((item) => (
                        <div
                            key={item.slot}
                            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] backdrop-blur-md border border-zinc-700/50 rounded-xl overflow-hidden"
                            style={{
                                background: 'rgba(0, 0, 0, 0.4)',
                                backgroundImage: 'linear-gradient(135deg, rgba(100, 253, 0, 0.04) 0%, rgba(0, 0, 0, 0.6) 100%)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(100, 253, 0, 0.02)'
                            }}
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-medium text-zinc-100 capitalize">
                                                {item.ability.name.replace('-', ' ')}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-zinc-400">
                                                Slot {item.slot}
                                            </p>
                                        </div>
                                    </div>
                                    {item.is_hidden && (
                                        <div className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                                            Hidden
                                        </div>
                                    )}
                                </div>
                                
                                <a 
                                    href={item.ability.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium group-hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span>View Details</span>
                                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {abilities.length === 0 && (
                    <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 mx-auto">
                            <svg className="h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-zinc-300 mb-2">No Abilities Found</h3>
                        <p className="text-zinc-400">Unable to load Pokemon abilities.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
)
}