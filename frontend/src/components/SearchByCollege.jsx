import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_URL } from "@/lib/api";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import searchBgImage from "@/assets/ChatGPT Image Aug 7, 2026, 12_02_14 AM.png";

const SearchByCollege = ({ onCollegeSearch }) => {
    const [colleges, setColleges] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await fetch(`${API_URL}/api/colleges/`);
                if (res.ok) {
                    const data = await res.json();
                    setColleges(data);
                }
            } catch (error) {
                console.error("Error fetching colleges:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchColleges();
    }, []);

    const handleSearch = () => {
        if (selectedCollege && onCollegeSearch) {
            onCollegeSearch(selectedCollege);
        }
    };

    return (
        <section id="search" className="relative pt-36 md:pt-44 pb-20 overflow-hidden">
            {/* Seamless Hero Background starting at absolute top of page */}
            <div className="absolute top-0 left-0 right-0 h-[680px] md:h-[740px] pointer-events-none overflow-hidden rounded-b-[3rem] md:rounded-b-[4rem] shadow-2xl shadow-purple-950/20">
                <img
                    src={searchBgImage}
                    alt="Search by College Background"
                    className="w-full h-full object-cover object-center scale-105"
                />
                {/* Gradient Vignette & Dark Overlay for maximum readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-purple-950/50 to-slate-900/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />
            </div>

            <div className="container relative z-10 px-4">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 text-white mb-6 shadow-xl"
                    >
                        <Building2 className="w-8 h-8 text-white drop-shadow-md" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white tracking-tight mb-4 drop-shadow-lg"
                    >
                        Search by <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">College</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-100/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow"
                    >
                        Find verified hostels and PGs within a 30km radius of your university
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <Card className="p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/80 bg-white/95 backdrop-blur-2xl">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-800 font-extrabold text-lg md:text-xl ml-1">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    Enter Your College Name
                                </div>

                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full h-16 justify-between rounded-2xl px-6 text-base md:text-lg border-slate-200/90 hover:border-indigo-500/60 hover:bg-slate-50/80 transition-all font-semibold text-slate-700 shadow-inner"
                                        >
                                            {selectedCollege ? (
                                                <span className="font-bold text-indigo-900">{selectedCollege.Name}</span>
                                            ) : (
                                                <span className="text-slate-400">Type your college name or select from list...</span>
                                            )}
                                            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-200">
                                        <Command className="w-full">
                                            <CommandInput placeholder="Search college by name..." className="h-14 text-base" />
                                            <CommandList>
                                                <CommandEmpty>No college found matching your search.</CommandEmpty>
                                                <CommandGroup>
                                                    {colleges.map((college) => (
                                                        <CommandItem
                                                            key={college.Name}
                                                            value={college.Name}
                                                            onSelect={() => {
                                                                setSelectedCollege(college);
                                                                setOpen(false);
                                                            }}
                                                            className="flex items-center gap-3 p-4 text-base cursor-pointer hover:bg-indigo-50/60 transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                                <Building2 className="w-4 h-4 text-indigo-600" />
                                                            </div>
                                                            <span className="font-bold text-slate-800">{college.Name}</span>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4 text-indigo-600 transition-opacity",
                                                                    selectedCollege?.Name === college.Name ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button
                                onClick={handleSearch}
                                disabled={!selectedCollege}
                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-black text-lg md:text-xl shadow-xl shadow-indigo-600/30 transition-all hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                            >
                                <Search className="w-6 h-6 mr-3" />
                                Search Nearby Hostels & PGs
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default SearchByCollege;
