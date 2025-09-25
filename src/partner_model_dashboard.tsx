import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { BusinessAssumptionsModal } from './components/BusinessAssumptionsModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { InfoIcon, HelpCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

const PartnerModelDashboard = () => {
  const [variables, setVariables] = useState({
    // Business Assumptions
    managementFeePercentage: 1.0, // Annual management fee as % of AUM
    attributableGrowthPercentage: 40, // % of AUM growth attributable to partner
    appointmentsPer50M: 20, // Appointments generated per $50M of attributable AUM
    
    // Model 1: The Secure Partner
    model1SetupFee: 7500,
    model1MonthlyRetainer: 4000,
    model1Bonus100M: 10000,
    model1Bonus250M: 20000,
    model1Bonus500M: 40000,
    
    // Model 2: The Growth Investor  
    model2SetupFee: 3000,
    model2MonthlyRetainer: 2500,
    model2InitialEquity: 1.0,
    model2EquityUnlock100M: 0.25,
    model2EquityUnlock250M: 0.50,
    model2EquityUnlock500M: 0.75,
    
    // Model 3: The Hybrid Achiever
    model3SetupFee: 5000,
    model3MonthlyRetainer: 3000,
    model3CommissionPerAppointment: 300,
    model3CommissionAUMPercentage: 0.05,
    model3EquityGrant: 0.25
  });

  const [selectedAUMLevels] = useState([50, 100, 250, 500, 750]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate annual revenue from AUM
  const calculateAnnualRevenue = (aumLevel: number) => {
    return aumLevel * 1000000 * (variables.managementFeePercentage / 100);
  };

  // Calculate compensation as percentage of revenue
  const calculateRevenuePercentage = (compensation: number, aumLevel: number) => {
    const revenue = calculateAnnualRevenue(aumLevel);
    return (compensation / revenue) * 100;
  };

  // Calculate Model 1: The Secure Partner
  const calculateModel1 = (aumLevel: number, includeSetup = false) => {
    const setupFee = includeSetup ? variables.model1SetupFee : 0;
    const annualRetainer = variables.model1MonthlyRetainer * 12;
    
    let bonus = 0;
    if (aumLevel >= 500) bonus = variables.model1Bonus500M;
    else if (aumLevel >= 250) bonus = variables.model1Bonus250M;
    else if (aumLevel >= 100) bonus = variables.model1Bonus100M;
    
    const totalComp = setupFee + annualRetainer + bonus;
    
    return {
      setup: setupFee,
      retainer: annualRetainer,
      bonus: bonus,
      commission: 0,
      equity: 0,
      totalCash: totalComp,
      revenuePercentage: calculateRevenuePercentage(totalComp, aumLevel)
    };
  };

  // Calculate Model 2: The Growth Investor
  const calculateModel2 = (aumLevel: number, includeSetup = false) => {
    const setupFee = includeSetup ? variables.model2SetupFee : 0;
    const annualRetainer = variables.model2MonthlyRetainer * 12;
    
    let cumulativeEquity = variables.model2InitialEquity;
    if (aumLevel >= 100) cumulativeEquity += variables.model2EquityUnlock100M;
    if (aumLevel >= 250) cumulativeEquity += variables.model2EquityUnlock250M;
    if (aumLevel >= 500) cumulativeEquity += variables.model2EquityUnlock500M;
    
    const totalCash = setupFee + annualRetainer;
    
    return {
      setup: setupFee,
      retainer: annualRetainer,
      bonus: 0,
      commission: 0,
      equity: cumulativeEquity,
      totalCash: totalCash,
      revenuePercentage: calculateRevenuePercentage(totalCash, aumLevel)
    };
  };

  // Calculate Model 3: The Hybrid Achiever
  const calculateModel3 = (aumLevel: number, includeSetup = false) => {
    const setupFee = includeSetup ? variables.model3SetupFee : 0;
    const annualRetainer = variables.model3MonthlyRetainer * 12;
    
    // Commission Calculations
    const attributableAUM = aumLevel * (variables.attributableGrowthPercentage / 100);
    const totalAppointments = (attributableAUM / 50) * variables.appointmentsPer50M;
    const appointmentCommission = totalAppointments * variables.model3CommissionPerAppointment;
    const aumCommission = attributableAUM * 1000000 * (variables.model3CommissionAUMPercentage / 100);
    const totalCommission = appointmentCommission + aumCommission;
    
    const totalCash = setupFee + annualRetainer + totalCommission;
    
    return {
      setup: setupFee,
      retainer: annualRetainer,
      bonus: 0,
      commission: totalCommission,
      equity: variables.model3EquityGrant,
      totalCash: totalCash,
      revenuePercentage: calculateRevenuePercentage(totalCash, aumLevel)
    };
  };

  // Update calculations when variables change
  useEffect(() => {
    const newComparisonData = selectedAUMLevels.map(aum => {
      const model1WithSetup = calculateModel1(aum, true);
      const model1Ongoing = calculateModel1(aum, false);
      const model2WithSetup = calculateModel2(aum, true);
      const model2Ongoing = calculateModel2(aum, false);
      const model3WithSetup = calculateModel3(aum, true);
      const model3Ongoing = calculateModel3(aum, false);

      return {
        aum,
        revenue: calculateAnnualRevenue(aum),
        model1WithSetup: model1WithSetup.totalCash,
        model1Ongoing: model1Ongoing.totalCash,
        model1Equity: model1WithSetup.equity,
        model1RevenuePercent: model1Ongoing.revenuePercentage,
        model2WithSetup: model2WithSetup.totalCash,
        model2Ongoing: model2Ongoing.totalCash,
        model2Equity: model2WithSetup.equity,
        model2RevenuePercent: model2Ongoing.revenuePercentage,
        model3WithSetup: model3WithSetup.totalCash,
        model3Ongoing: model3Ongoing.totalCash,
        model3Equity: model3WithSetup.equity,
        model3RevenuePercent: model3Ongoing.revenuePercentage,
        details: {
          model1WithSetup,
          model1Ongoing,
          model2WithSetup,
          model2Ongoing,
          model3WithSetup,
          model3Ongoing
        }
      };
    });

    setComparisonData(newComparisonData);
    setChartData(newComparisonData);
  }, [variables, selectedAUMLevels]);

  const updateVariable = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (amount: number, decimals = 1) => {
    return `${amount.toFixed(decimals)}%`;
  };


  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Partner Model Dashboard
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="w-6 h-6 ml-2 text-blue-500 hover:text-blue-700 cursor-help inline" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>✅ shadcn/ui tooltip is working! Hover over info icons to see detailed explanations.</p>
                </TooltipContent>
              </Tooltip>
            </h1>
            <p className="text-lg text-gray-600">Compare compensation models and analyze revenue impact</p>
          </div>
      
      {/* Business Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Business Assumptions</span>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              How do these work?
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Annual Management Fee (%)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={variables.managementFeePercentage}
                onChange={(e) => updateVariable('managementFeePercentage', e.target.value)}
                className="text-center font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Attributable Growth (%)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>% of AUM growth credited to partner's efforts</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                type="number"
                value={variables.attributableGrowthPercentage}
                onChange={(e) => updateVariable('attributableGrowthPercentage', e.target.value)}
                className="text-center font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Appointments per $50M AUM
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 text-gray-400 hover:text-purple-600 cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Client meetings generated per $50M of attributable AUM</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                type="number"
                value={variables.appointmentsPer50M}
                onChange={(e) => updateVariable('appointmentsPer50M', e.target.value)}
                className="text-center font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model-Specific Input Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model 1 Inputs */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-t-xl">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              Model 1: Fee Based Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Setup Fee</label>
              <Input
                type="number"
                value={variables.model1SetupFee}
                onChange={(e) => updateVariable('model1SetupFee', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Monthly Retainer</label>
              <Input
                type="number"
                value={variables.model1MonthlyRetainer}
                onChange={(e) => updateVariable('model1MonthlyRetainer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="border-t pt-3">
              <label className="text-xs text-gray-500 block mb-2">Performance Bonuses</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 block">$100M AUM Bonus</label>
                  <Input
                    type="number"
                    value={variables.model1Bonus100M}
                    onChange={(e) => updateVariable('model1Bonus100M', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">$250M AUM Bonus</label>
                  <Input
                    type="number"
                    value={variables.model1Bonus250M}
                    onChange={(e) => updateVariable('model1Bonus250M', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">$500M AUM Bonus</label>
                  <Input
                    type="number"
                    value={variables.model1Bonus500M}
                    onChange={(e) => updateVariable('model1Bonus500M', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model 2 Inputs */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 rounded-t-xl">
            <CardTitle className="text-green-900 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              Model 2: Equity Based Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Setup Fee</label>
              <Input
                type="number"
                value={variables.model2SetupFee}
                onChange={(e) => updateVariable('model2SetupFee', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Monthly Retainer</label>
              <Input
                type="number"
                value={variables.model2MonthlyRetainer}
                onChange={(e) => updateVariable('model2MonthlyRetainer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="border-t pt-3">
              <label className="text-xs text-gray-500 block mb-2">Equity Structure (%)</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 block">Initial Grant</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={variables.model2InitialEquity}
                    onChange={(e) => updateVariable('model2InitialEquity', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">$100M AUM Unlock</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={variables.model2EquityUnlock100M}
                    onChange={(e) => updateVariable('model2EquityUnlock100M', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">$250M AUM Unlock</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={variables.model2EquityUnlock250M}
                    onChange={(e) => updateVariable('model2EquityUnlock250M', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">$500M AUM Unlock</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={variables.model2EquityUnlock500M}
                    onChange={(e) => updateVariable('model2EquityUnlock500M', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model 3 Inputs */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-t-xl">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              Model 3: Hybrid Fee/Equity Partner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Setup Fee</label>
              <Input
                type="number"
                value={variables.model3SetupFee}
                onChange={(e) => updateVariable('model3SetupFee', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Monthly Retainer</label>
              <Input
                type="number"
                value={variables.model3MonthlyRetainer}
                onChange={(e) => updateVariable('model3MonthlyRetainer', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
            </div>
            <div className="border-t pt-3">
              <label className="text-xs text-gray-500 block mb-2">Commission Structure</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 block">Per Appointment</label>
                  <Input
                    type="number"
                    value={variables.model3CommissionPerAppointment}
                    onChange={(e) => updateVariable('model3CommissionPerAppointment', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">AUM Commission (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variables.model3CommissionAUMPercentage}
                    onChange={(e) => updateVariable('model3CommissionAUMPercentage', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block">Equity Grant (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={variables.model3EquityGrant}
                    onChange={(e) => updateVariable('model3EquityGrant', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Model Comparison with Revenue Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-800">AUM Level</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Annual Revenue</th>
                  <th className="text-center p-4 font-semibold text-blue-800">Model 1: Fee Based Partner</th>
                  <th className="text-center p-4 font-semibold text-green-800">Model 2: Equity Based Partner</th>
                  <th className="text-center p-4 font-semibold text-purple-800">Model 3: Hybrid Fee/Equity Partner</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.aum} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors duration-200">
                    <td className="p-4 font-bold text-gray-900">${row.aum}M AUM</td>
                    <td className="p-4 text-gray-700 font-medium">{formatCurrency(row.revenue)}</td>
                    <td className="p-4 text-center">
                      <div className="text-sm">
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(row.model1Ongoing)}
                          <span className="text-xs text-gray-500 block">
                            ({formatPercentage(row.model1RevenuePercent)} of revenue)
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          +{formatCurrency(variables.model1SetupFee)} setup
                        </div>
                        <div className="text-xs text-gray-500">Equity: {formatPercentage(row.model1Equity)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-sm">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(row.model2Ongoing)}
                          <span className="text-xs text-gray-500 block">
                            ({formatPercentage(row.model2RevenuePercent)} of revenue)
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          +{formatCurrency(variables.model2SetupFee)} setup
                        </div>
                        <div className="text-xs text-gray-500">Equity: {formatPercentage(row.model2Equity)}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-sm">
                        <div className="font-semibold text-purple-600">
                          {formatCurrency(row.model3Ongoing)}
                          <span className="text-xs text-gray-500 block">
                            ({formatPercentage(row.model3RevenuePercent)} of revenue)
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          +{formatCurrency(variables.model3SetupFee)} setup
                        </div>
                        <div className="text-xs text-gray-500">Equity: {formatPercentage(row.model3Equity)}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ongoing Compensation Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="aum" tickFormatter={(value) => `$${value}M`} />
                <YAxis tickFormatter={(value) => `$${value/1000}K`} />
                <RechartsTooltip 
                  formatter={(value: any, name: any) => [formatCurrency(Number(value)), name]}
                  labelFormatter={(label: any) => `$${label}M AUM`}
                />
                <Legend />
                <Bar dataKey="model1Ongoing" fill="#3B82F6" name="Model 1: Fee Based" />
                <Bar dataKey="model2Ongoing" fill="#10B981" name="Model 2: Equity Based" />
                <Bar dataKey="model3Ongoing" fill="#8B5CF6" name="Model 3: Hybrid" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Impact Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="aum" tickFormatter={(value) => `$${value}M`} />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip 
                  formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]}
                  labelFormatter={(label: any) => `$${label}M AUM`}
                />
                <Legend />
                <Line type="monotone" dataKey="model1RevenuePercent" stroke="#3B82F6" strokeWidth={2} name="Model 1 %" />
                <Line type="monotone" dataKey="model2RevenuePercent" stroke="#10B981" strokeWidth={2} name="Model 2 %" />
                <Line type="monotone" dataKey="model3RevenuePercent" stroke="#8B5CF6" strokeWidth={2} name="Model 3 %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Business Assumptions Modal */}
      <BusinessAssumptionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      </div>
    </div>
    </TooltipProvider>
  );
};

export default PartnerModelDashboard;