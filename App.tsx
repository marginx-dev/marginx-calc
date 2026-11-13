import { useEffect, useState } from 'react';
import { BottomNav, type AppTab } from './components/BottomNav';
import { CalculatorView } from './components/CalculatorView';
import { Header } from './components/Header';
import { HistoryView } from './components/HistoryView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useTheme } from './hooks/useTheme';
import {
  DEFAULT_CALCULATOR_INPUTS,
  RESET_CALCULATOR_INPUTS,
  calculateCODProfit,
  type CalculatorInputs,
} from './utils/calculator';
import {
  createSavedEntry,
  loadSavedCalculations,
  persistSavedCalculations,
  type SavedCalculation,
} from './utils/storage';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
  const [inputs, setInputs] = useState<CalculatorInputs>(
    DEFAULT_CALCULATOR_INPUTS,
  );
  const [savedItems, setSavedItems] = useState<SavedCalculation[]>(() =>
    loadSavedCalculations(),
  );

  useEffect(() => {
    persistSavedCalculations(savedItems);
  }, [savedItems]);

  const handleSaveCalculation = () => {
    const result = calculateCODProfit(inputs);
    const entry = createSavedEntry(inputs, result);
    setSavedItems((prev) => [entry, ...prev]);
  };

  const handleReset = () => {
    setInputs({ ...RESET_CALCULATOR_INPUTS });
  };

  const handleLoadEntry = (entry: SavedCalculation) => {
    setInputs({ ...entry.inputs });
    setActiveTab('calculator');
  };

  const handleDeleteEntry = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setSavedItems([]);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-4 sm:pt-6 pb-24">
        {activeTab === 'calculator' ? (
          <CalculatorView
            inputs={inputs}
            onChangeInputs={setInputs}
            onSaveCalculation={handleSaveCalculation}
            onReset={handleReset}
          />
        ) : (
          <HistoryView
            items={savedItems}
            onLoadEntry={handleLoadEntry}
            onDeleteEntry={handleDeleteEntry}
            onClearAll={handleClearAll}
            onGoToCalculator={() => setActiveTab('calculator')}
          />
        )}
      </main>

      <OfflineIndicator />
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedItems.length}
      />
    </div>
  );
}
