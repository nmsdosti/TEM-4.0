import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Receipt, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plane,
  Utensils,
  Home,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget_accommodation: number;
  budget_travel: number;
  budget_food: number;
  budget_other: number;
}

interface Expense {
  id: string;
  trip_id: string;
  category: string;
  amount: number;
  description: string;
  expense_date: string;
}

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [showBudgets, setShowBudgets] = useState(true);

  const [expenseForm, setExpenseForm] = useState({
    category: "food",
    amount: "",
    description: ""
  });

  const categoryConfig = {
    accommodation: { 
      icon: Home, 
      color: "bg-blue-500", 
      lightColor: "bg-blue-50 text-blue-700 border-blue-200",
      label: "🏠",
      name: "Stay"
    },
    travel: { 
      icon: Plane, 
      color: "bg-green-500", 
      lightColor: "bg-green-50 text-green-700 border-green-200",
      label: "✈️",
      name: "Travel"
    },
    food: { 
      icon: Utensils, 
      color: "bg-orange-500", 
      lightColor: "bg-orange-50 text-orange-700 border-orange-200",
      label: "🍽️",
      name: "Food"
    },
    other: { 
      icon: ShoppingBag, 
      color: "bg-purple-500", 
      lightColor: "bg-purple-50 text-purple-700 border-purple-200",
      label: "🛍️",
      name: "Other"
    }
  };

  useEffect(() => {
    if (tripId && user) {
      fetchTripDetails();
      fetchExpenses();
    }
  }, [tripId, user]);

  const fetchTripDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) throw error;
      setTrip(data);
    } catch (error) {
      console.error('Error fetching trip:', error);
      toast({
        title: "❌ Error",
        description: "Failed to load trip details",
        variant: "destructive"
      });
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          ...expenseForm,
          trip_id: tripId,
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
        title: "✅ Success",
        description: "Expense added successfully!"
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "❌ Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      toast({
        title: "🗑️ Deleted",
        description: "Expense removed successfully"
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "❌ Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    if (!trip || expenses.length === 0) return;

    const csvContent = [
      ['Date', 'Category', 'Description', 'Amount (₹)'],
      ...expenses.map(expense => [
        new Date(expense.expense_date).toLocaleDateString(),
        categoryConfig[expense.category as keyof typeof categoryConfig].name,
        expense.description || '',
        expense.amount.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name.replace(/\s+/g, '_')}_expenses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "📊 Exported",
      description: "Data exported successfully!"
    });
  };

  const getCategoryExpenses = (category: string) => {
    return expenses.filter(expense => expense.category === category);
  };

  const getCategoryTotal = (category: string) => {
    return getCategoryExpenses(category).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalSpent = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalBudget = () => {
    if (!trip) return 0;
    return trip.budget_accommodation + trip.budget_travel + trip.budget_food + trip.budget_other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">❌ Trip not found</h2>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const totalSpent = getTotalSpent();
  const totalBudget = getTotalBudget();
  const remaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  {trip.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(trip.start_date).toLocaleDateString()} → {new Date(trip.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBudgets(!showBudgets)}
                className="rounded-full"
              >
                {showBudgets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={expenses.length === 0}
                className="rounded-full"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </Button>
              <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-green-500" />
                      Add Expense
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addExpense} className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label} {config.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                        placeholder="0.00"
                        className="rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                        placeholder="What was this for?"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddExpenseOpen(false)} className="flex-1 rounded-xl">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl">
                        ✅ Add
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Overview */}
        {showBudgets && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">₹{totalBudget.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Budget</div>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-3xl font-bold flex items-center justify-center gap-2 ${
                      remaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {remaining >= 0 ? (
                        <TrendingDown className="h-6 w-6" />
                      ) : (
                        <TrendingUp className="h-6 w-6" />
                      )}
                      ₹{Math.abs(remaining).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {remaining >= 0 ? 'Under Budget' : 'Over Budget'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Breakdown */}
        {showBudgets && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(categoryConfig).map(([category, config]) => {
              const spent = getCategoryTotal(category);
              const budget = trip[`budget_${category}` as keyof Trip] as number;
              const percentage = budget > 0 ? (spent / budget) * 100 : 0;

              return (
                <Card key={category} className="hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.label}</span>
                        <span className="font-medium text-sm">{config.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{getCategoryExpenses(category).length}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-semibold">₹{spent.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${config.color}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">₹{budget.toFixed(2)} budget</span>
                        <span className={`font-medium ${spent > budget ? 'text-red-600' : 'text-green-600'}`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Expenses List */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-gray-700" />
                Expenses ({expenses.length})
              </CardTitle>
              {expenses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="rounded-full"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-500 mb-6">Start tracking your trip expenses</p>
                <Button onClick={() => setIsAddExpenseOpen(true)} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Expense
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {expenses.map((expense) => {
                  const config = categoryConfig[expense.category as keyof typeof categoryConfig];

                  return (
                    <div key={expense.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-2xl">{config.label}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {expense.description || `${config.name} expense`}
                              </span>
                              <Badge variant="secondary" className={`${config.lightColor} text-xs`}>
                                {config.name}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(expense.expense_date).toLocaleDateString()} at {new Date(expense.expense_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">₹{expense.amount.toFixed(2)}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}