import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Calendar, DollarSign, Receipt, Edit2 } from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget_accommodation: number;
  budget_travel: number;
  budget_food: number;
  budget_other: number;
  created_at: string;
}

interface Expense {
  id: string;
  trip_id: string;
  category: string;
  amount: number;
  description: string;
  expense_date: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [selectedTripForEdit, setSelectedTripForEdit] = useState<Trip | null>(null);

  // Trip form state
  const [tripForm, setTripForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    budget_accommodation: "",
    budget_travel: "",
    budget_food: "",
    budget_other: ""
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    category: "food",
    amount: "",
    description: ""
  });

  useEffect(() => {
    if (user) {
      fetchTrips();
      fetchExpenses();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({
        title: "Error",
        description: "Failed to load trips",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const createTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([{
          ...tripForm,
          user_id: user?.id,
          budget_accommodation: parseFloat(tripForm.budget_accommodation) || 0,
          budget_travel: parseFloat(tripForm.budget_travel) || 0,
          budget_food: parseFloat(tripForm.budget_food) || 0,
          budget_other: parseFloat(tripForm.budget_other) || 0
        }])
        .select()
        .single();

      if (error) throw error;

      setTrips([data, ...trips]);
      setIsCreateTripOpen(false);
      setTripForm({
        name: "",
        start_date: "",
        end_date: "",
        budget_accommodation: "",
        budget_travel: "",
        budget_food: "",
        budget_other: ""
      });

      toast({
        title: "Success",
        description: "Trip created successfully!"
      });
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error",
        description: "Failed to create trip",
        variant: "destructive"
      });
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseForm,
          trip_id: selectedTrip.id,
          user_id: user?.id,
          amount: parseFloat(expenseForm.amount)
        }])
        .select()
        .single();

      if (error) throw error;

      setExpenses([data, ...expenses]);
      setIsAddExpenseOpen(false);
      setExpenseForm({
        category: "food",
        amount: "",
        description: ""
      });

      toast({
        title: "Success",
        description: "Expense added successfully!"
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  };

  const updateTripBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripForEdit) return;

    try {
      const { error } = await supabase
        .from('trips')
        .update({
          budget_accommodation: parseFloat(tripForm.budget_accommodation) || 0,
          budget_travel: parseFloat(tripForm.budget_travel) || 0,
          budget_food: parseFloat(tripForm.budget_food) || 0,
          budget_other: parseFloat(tripForm.budget_other) || 0
        })
        .eq('id', selectedTripForEdit.id);

      if (error) throw error;

      // Update local state
      setTrips(trips.map(trip => 
        trip.id === selectedTripForEdit.id 
          ? {
              ...trip,
              budget_accommodation: parseFloat(tripForm.budget_accommodation) || 0,
              budget_travel: parseFloat(tripForm.budget_travel) || 0,
              budget_food: parseFloat(tripForm.budget_food) || 0,
              budget_other: parseFloat(tripForm.budget_other) || 0
            }
          : trip
      ));

      setIsEditBudgetOpen(false);
      setSelectedTripForEdit(null);
      toast({
        title: "✅ Budget Updated",
        description: "Trip budget updated successfully!"
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "❌ Error",
        description: "Failed to update budget",
        variant: "destructive"
      });
    }
  };

  const openEditBudget = (trip: Trip) => {
    setSelectedTripForEdit(trip);
    setTripForm({
      name: trip.name,
      start_date: trip.start_date,
      end_date: trip.end_date,
      budget_accommodation: trip.budget_accommodation.toString(),
      budget_travel: trip.budget_travel.toString(),
      budget_food: trip.budget_food.toString(),
      budget_other: trip.budget_other.toString()
    });
    setIsEditBudgetOpen(true);
  };

  const getTripExpenses = (tripId: string) => {
    return expenses.filter(expense => expense.trip_id === tripId);
  };

  const getTripTotal = (tripId: string) => {
    return getTripExpenses(tripId).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTripBudget = (trip: Trip) => {
    return trip.budget_accommodation + trip.budget_travel + trip.budget_food + trip.budget_other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">⏳ Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">💼 Trip Expense Manager</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">👋 {user?.email}</span>
              <Button variant="outline" onClick={signOut} className="rounded-full text-xs sm:text-sm">
                🚪 Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">✈️ Your Trips</h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">📊 Manage your travel expenses</p>
          </div>
          
          <Dialog open={isCreateTripOpen} onOpenChange={setIsCreateTripOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                ✨ New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Create New Trip
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={createTrip} className="space-y-4">
                <div>
                  <Label htmlFor="name">Trip Name</Label>
                  <Input
                    id="name"
                    value={tripForm.name}
                    onChange={(e) => setTripForm({...tripForm, name: e.target.value})}
                    placeholder="e.g., Summer Vacation"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={tripForm.start_date}
                      onChange={(e) => setTripForm({...tripForm, start_date: e.target.value})}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={tripForm.end_date}
                      onChange={(e) => setTripForm({...tripForm, end_date: e.target.value})}
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget_accommodation">🏠 Stay Budget (₹)</Label>
                    <Input
                      id="budget_accommodation"
                      type="number"
                      step="0.01"
                      value={tripForm.budget_accommodation}
                      onChange={(e) => setTripForm({...tripForm, budget_accommodation: e.target.value})}
                      placeholder="0.00"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget_travel">✈️ Travel Budget (₹)</Label>
                    <Input
                      id="budget_travel"
                      type="number"
                      step="0.01"
                      value={tripForm.budget_travel}
                      onChange={(e) => setTripForm({...tripForm, budget_travel: e.target.value})}
                      placeholder="0.00"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget_food">🍽️ Food Budget (₹)</Label>
                    <Input
                      id="budget_food"
                      type="number"
                      step="0.01"
                      value={tripForm.budget_food}
                      onChange={(e) => setTripForm({...tripForm, budget_food: e.target.value})}
                      placeholder="0.00"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget_other">🛍️ Other Budget (₹)</Label>
                    <Input
                      id="budget_other"
                      type="number"
                      step="0.01"
                      value={tripForm.budget_other}
                      onChange={(e) => setTripForm({...tripForm, budget_other: e.target.value})}
                      placeholder="0.00"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateTripOpen(false)} className="flex-1 rounded-xl">
                    ❌ Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl">
                    ✅ Create Trip
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
              <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🌟 No trips yet</h3>
              <p className="text-gray-600 mb-8 text-sm sm:text-base">Create your first trip to start tracking expenses</p>
              <Button onClick={() => setIsCreateTripOpen(true)} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                🚀 Create Your First Trip
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trips.map((trip) => {
              const totalSpent = getTripTotal(trip.id);
              const totalBudget = getTripBudget(trip);
              const tripExpenses = getTripExpenses(trip.id);
              const remaining = totalBudget - totalSpent;

              return (
                <Card 
                  key={trip.id} 
                  className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg cursor-pointer" onClick={() => navigate(`/trip/${trip.id}`)}>
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="line-clamp-1">{trip.name}</span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditBudget(trip);
                        }}
                        className="rounded-full hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4 text-blue-500" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">{new Date(trip.start_date).toLocaleDateString()} → {new Date(trip.end_date).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4" onClick={() => navigate(`/trip/${trip.id}`)}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Spent</span>
                      <span className="font-bold text-lg sm:text-xl">₹{totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Budget</span>
                      <span className="text-sm font-medium">₹{totalBudget.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          totalSpent > totalBudget 
                            ? 'bg-gradient-to-r from-red-500 to-red-600' 
                            : 'bg-gradient-to-r from-green-500 to-green-600'
                        }`}
                        style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">📊 {tripExpenses.length} expenses</span>
                      <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left' : 'over'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-center text-xs sm:text-sm text-gray-500">
                        👆 Click to view details
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Budget Dialog */}
        <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-blue-500" />
                Edit Budget
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={updateTripBudget} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_budget_accommodation">🏠 Stay (₹)</Label>
                  <Input
                    id="edit_budget_accommodation"
                    type="number"
                    step="0.01"
                    value={tripForm.budget_accommodation}
                    onChange={(e) => setTripForm({...tripForm, budget_accommodation: e.target.value})}
                    placeholder="0.00"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_budget_travel">✈️ Travel (₹)</Label>
                  <Input
                    id="edit_budget_travel"
                    type="number"
                    step="0.01"
                    value={tripForm.budget_travel}
                    onChange={(e) => setTripForm({...tripForm, budget_travel: e.target.value})}
                    placeholder="0.00"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_budget_food">🍽️ Food (₹)</Label>
                  <Input
                    id="edit_budget_food"
                    type="number"
                    step="0.01"
                    value={tripForm.budget_food}
                    onChange={(e) => setTripForm({...tripForm, budget_food: e.target.value})}
                    placeholder="0.00"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_budget_other">🛍️ Other (₹)</Label>
                  <Input
                    id="edit_budget_other"
                    type="number"
                    step="0.01"
                    value={tripForm.budget_other}
                    onChange={(e) => setTripForm({...tripForm, budget_other: e.target.value})}
                    placeholder="0.00"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditBudgetOpen(false)} className="flex-1 rounded-xl">
                  ❌ Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl">
                  ✅ Update Budget
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}