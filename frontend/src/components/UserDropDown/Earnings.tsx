import Navbar from "../Navbar"

function Earnings() {
  const vehicleEarnings = [
    {
      company: "Hyundai",
      model: "Creta",
      type: "Car",
      bookings: 12,
      earnings: 72000,
    },
    {
      company: "Royal Enfield",
      model: "Classic 350",
      type: "Bike",
      bookings: 8,
      earnings: 52500,
    },
  ]

  const transactions = [
    {
      vehicle: "Hyundai Creta",
      date: "02 Sep 2026",
      booking: "RX10248",
      gross: 7200,
      fee: 360,
      net: 6840,
      status: "Paid",
    },
    {
      vehicle: "Royal Enfield Classic 350",
      date: "28 Aug 2026",
      booking: "RX10192",
      gross: 4000,
      fee: 200,
      net: 3800,
      status: "Paid",
    },
    {
      vehicle: "Hyundai Creta",
      date: "24 Aug 2026",
      booking: "RX10145",
      gross: 5400,
      fee: 270,
      net: 5130,
      status: "Pending",
    },
  ]

  return (
    <main className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              Host Dashboard
            </p>

            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              Earnings
            </h1>

            <p className="mt-2 text-gray-500">
              Track your rental income and payouts.
            </p>
          </div>

          {/* TOP STATS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <EarningStat
              title="Total Earnings"
              value="₹1,24,500"
              subtitle="All time"
              highlight
            />

            <EarningStat
              title="This Month"
              value="₹18,400"
              subtitle="+12.5% from last month"
            />

            <EarningStat
              title="Pending Payout"
              value="₹4,200"
              subtitle="Processing"
            />

            <EarningStat
              title="Paid Out"
              value="₹1,20,300"
              subtitle="Successfully transferred"
            />

          </div>

          {/* CHART + BREAKDOWN */}
          <div className="mt-7 grid gap-6 lg:grid-cols-[1.6fr_1fr]">

            {/* CHART */}
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Earnings Overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your rental earnings over the last 6 months.
                  </p>
                </div>

                <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 outline-none">
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
              </div>

              {/* SIMPLE BAR CHART */}
              <div className="mt-8 flex h-64 items-end justify-between gap-4 border-b border-gray-100 px-2">

                <ChartBar month="Apr" value="₹14k" height="35%" />
                <ChartBar month="May" value="₹18k" height="48%" />
                <ChartBar month="Jun" value="₹21k" height="58%" />
                <ChartBar month="Jul" value="₹17k" height="45%" />
                <ChartBar month="Aug" value="₹24k" height="70%" />
                <ChartBar month="Sep" value="₹18k" height="53%" />

              </div>

            </div>

            {/* SUMMARY */}
            <div className="rounded-3xl bg-[#171717] p-7 text-white shadow-[0_15px_40px_rgba(0,0,0,0.15)]">

              <h2 className="text-xl font-bold">
                Earnings Breakdown
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                How your earnings are calculated.
              </p>

              <div className="mt-8 space-y-5">

                <BreakdownRow
                  label="Gross Earnings"
                  value="₹1,32,000"
                />

                <BreakdownRow
                  label="RideX Platform Fee"
                  value="- ₹6,600"
                />

                <BreakdownRow
                  label="Other Adjustments"
                  value="- ₹900"
                />

                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Net Earnings
                    </span>

                    <span className="text-2xl font-black text-orange-400">
                      ₹1,24,500
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* VEHICLE PERFORMANCE */}
          <div className="mt-7 rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle-wise Earnings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                See how much each vehicle has earned.
              </p>
            </div>

            <div className="space-y-6">

              {vehicleEarnings.map((vehicle) => {

                const percentage =
                  (vehicle.earnings / 124500) * 100

                return (
                  <div key={vehicle.model}>

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                          {vehicle.type === "Car" ? "🚗" : "🏍️"}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {vehicle.company} {vehicle.model}
                          </p>

                          <p className="text-xs text-gray-400">
                            {vehicle.bookings} bookings
                          </p>
                        </div>

                      </div>

                      <span className="text-lg font-black text-gray-900">
                        ₹{vehicle.earnings.toLocaleString()}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className="mt-7 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

            <div className="border-b border-gray-100 px-7 py-5">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Earnings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recent completed rental transactions.
              </p>
            </div>

            <div className="divide-y divide-gray-100">

              {transactions.map((transaction) => (
                <div
                  key={transaction.booking}
                  className="flex flex-col gap-4 px-7 py-5 lg:flex-row lg:items-center"
                >

                  {/* VEHICLE */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {transaction.vehicle}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {transaction.booking} · {transaction.date}
                    </p>
                  </div>

                  {/* GROSS */}
                  <div>
                    <p className="text-xs text-gray-400">
                      Gross
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-800">
                      ₹{transaction.gross.toLocaleString()}
                    </p>
                  </div>

                  {/* FEE */}
                  <div>
                    <p className="text-xs text-gray-400">
                      Platform Fee
                    </p>

                    <p className="mt-1 text-sm font-bold text-red-500">
                      - ₹{transaction.fee.toLocaleString()}
                    </p>
                  </div>

                  {/* NET */}
                  <div>
                    <p className="text-xs text-gray-400">
                      Net Earnings
                    </p>

                    <p className="mt-1 text-sm font-black text-gray-900">
                      ₹{transaction.net.toLocaleString()}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        transaction.status === "Paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-orange-500"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>

                </div>
              ))}

            </div>
          </div>

        </div>
      </section>
    </main>
  )
}

function EarningStat({
  title,
  value,
  subtitle,
  highlight = false,
}: {
  title: string
  value: string
  subtitle: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-[0_6px_20px_rgba(0,0,0,0.04)] ${
        highlight
          ? "border-orange-200 bg-orange-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-sm font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-2xl font-black text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {subtitle}
      </p>
    </div>
  )
}

function BreakdownRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">
        {label}
      </span>

      <span className="text-sm font-bold text-white">
        {value}
      </span>
    </div>
  )
}

function ChartBar({
  month,
  value,
  height,
}: {
  month: string
  value: string
  height: string
}) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">

      <span className="text-[10px] font-bold text-gray-400">
        {value}
      </span>

      <div
        className="w-full max-w-12 rounded-t-lg bg-orange-500 transition hover:bg-orange-600"
        style={{ height }}
      />

      <span className="text-xs font-semibold text-gray-400">
        {month}
      </span>

    </div>
  )
}

export default Earnings