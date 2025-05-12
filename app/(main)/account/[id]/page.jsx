
import { getAccountWithTransactions } from '@/actions/accounts';
import { IndianRupeeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import TransactionTable from '../_components/transaction-table';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/account-chart';

const AccountsPage = async ({ params }) => {

  const accountId = params?.id;
  if (!accountId) return notFound();

  let accountData
  try {
   accountData = await getAccountWithTransactions(accountId);
  } catch (error) {
    console.error("Error fetching account data:", error);
    return notFound();
  }

  if (!accountData) return notFound();

  const { transactions, ...account } = accountData;

  return (
    <div className='p-10'>
      <div className="space-y-8 px-5 flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-extrabold capitalize bg-gradient-to-br from-black to-blue-500 bg-clip-text text-transparent">
            {account.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            {account.type?.[0].toUpperCase() + account.type?.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-3xl sm:text-4xl font-bold">
            <IndianRupeeIcon className="inline-flex" /> {Number(account.balance || 0).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count?.transactions ?? 0} Transactions
          </p>
        </div>
      </div>

      {transactions ? (
        <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
          <AccountChart transactions={transactions}/>
          <TransactionTable transactions={transactions} />
        </Suspense>
      ) : (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}
    </div>
  );
};

export default AccountsPage;
