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
        <section id="search" className="relative py-24 overflow-hidden">
            {/* Background Gradient Header */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-br from-indigo-600 via-purple-600 to-primary pointer-events-none" />

            <div className="container relative z-10 px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white mb-6"
                    >
                        <Building2 className="w-8 h-8" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white mb-4"
                    >
                        Search by College
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg md:text-xl font-medium"
                    >
                        Find hostels and PGs within 30km radius of your college
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-none bg-white/95 backdrop-blur-xl">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-800 font-bold text-xl ml-2">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
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
                                            className="w-full h-16 justify-between rounded-2xl px-6 text-lg border-slate-200 hover:border-primary/50 transition-all font-medium text-slate-600"
                                        >
                                            {selectedCollege
                                                ? selectedCollege.Name
                                                : "Type your college name or select from list..."}
                                            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-2xl overflow-hidden shadow-2xl border-slate-100">
                                        <Command className="w-full">
                                            <CommandInput placeholder="Search college..." className="h-14 text-base" />
                                            <CommandList>
                                                <CommandEmpty>No college found.</CommandEmpty>
                                                <CommandGroup>
                                                    {colleges.map((college) => (
                                                        <CommandItem
                                                            key={college.Name}
                                                            value={college.Name}
                                                            onSelect={() => {
                                                                setSelectedCollege(college);
                                                                setOpen(false);
                                                            }}
                                                            className="flex items-center gap-3 p-4 text-base cursor-pointer hover:bg-slate-50"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <span className="font-bold text-slate-700">{college.Name}</span>
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto h-4 w-4 text-primary transition-opacity",
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
                                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
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
