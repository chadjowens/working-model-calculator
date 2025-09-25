import { Modal } from './ui/modal';

interface BusinessAssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessAssumptionsModal = ({ isOpen, onClose }: BusinessAssumptionsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Understanding Business Assumptions">
      <div className="space-y-8">
        
        {/* Annual Management Fee */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Annual Management Fee (%)
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The percentage of total Assets Under Management (AUM) that your firm charges clients annually. 
            This is your primary revenue source.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">Example:</p>
            <p className="text-blue-700 text-sm mt-1">
              $100M AUM × 1.0% fee = <strong>$1,000,000</strong> annual revenue
            </p>
          </div>
        </section>

        {/* Attributable Growth */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
            Attributable Growth Percentage
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The percentage of total AUM growth that can be directly attributed to the partner's efforts. 
            Not all growth comes from the partner—some comes from market performance, existing client organic growth, or other team members.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Example Scenario:</p>
            <ul className="text-green-700 text-sm mt-2 space-y-1">
              <li>• Firm grows from $100M to $200M AUM (+$100M growth)</li>
              <li>• Attributable Growth = 40%</li>
              <li>• <strong>Partner gets credit for:</strong> $100M × 40% = <strong>$40M</strong></li>
            </ul>
          </div>
          <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm">
              <strong>Why it matters:</strong> This isolates the partner's direct contribution and is used 
              to calculate commissions in Model 3 (Hybrid Achiever).
            </p>
          </div>
        </section>

        {/* Appointments per 50M AUM */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
            Appointments Per $50M AUM
          </h3>
          <p className="text-gray-700 leading-relaxed">
            How many client meetings/appointments the partner generates for every $50M of their attributable AUM. 
            This reflects relationship management and business development activity.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800 font-medium">Example Calculation:</p>
            <ul className="text-purple-700 text-sm mt-2 space-y-1">
              <li>• Partner has $200M attributable AUM</li>
              <li>• Appointments per $50M = 20</li>
              <li>• <strong>Total appointments:</strong> ($200M ÷ $50M) × 20 = <strong>80 appointments</strong></li>
            </ul>
          </div>
          <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
            <p className="text-gray-600 text-sm">
              <strong>Business Logic:</strong> Larger AUM clients typically require more ongoing meetings. 
              Each appointment has value in Model 3 (default: $300/appointment).
            </p>
          </div>
        </section>

        {/* How They Work Together */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
            How They Work Together (Model 3 Example)
          </h3>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <div className="space-y-2 text-sm">
              <p className="font-medium text-orange-900">Partner brings in $500M total AUM</p>
              <p className="text-orange-800">↓ Attributable Growth (40%) = $200M credited to partner</p>
              <p className="text-orange-800">↓ Appointments = ($200M ÷ $50M) × 20 = 80 appointments</p>
              <p className="text-orange-800">↓ Commission Calculation:</p>
              <div className="ml-4 space-y-1">
                <p className="text-orange-700">• Appointment Commission: 80 × $300 = $24,000</p>
                <p className="text-orange-700">• AUM Commission: $200M × 0.05% = $10,000</p>
                <p className="font-bold text-orange-900">• Total Commission: $34,000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Configurable */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
            Why These Are Configurable
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Different firms have different business models:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-900">Attribution Models</h4>
              <p className="text-gray-600 text-sm mt-1">Some partners drive 60%+ of growth, others 20%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-900">Service Models</h4>
              <p className="text-gray-600 text-sm mt-1">High-touch vs. low-touch client relationships</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-900">Client Concentration</h4>
              <p className="text-gray-600 text-sm mt-1">Fewer large clients vs. many smaller ones</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-900">Market Dynamics</h4>
              <p className="text-gray-600 text-sm mt-1">Growth rates vary by geography and client type</p>
            </div>
          </div>
        </section>

      </div>
    </Modal>
  );
};