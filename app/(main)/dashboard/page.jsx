import React, { Suspense } from 'react'
import DashBoardLayout from './layout'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getDashboardData, getUserAccounts } from '@/actions/dashboard'
import AccountCard from './_components/account-card'
import { getCurrentBudget } from '@/actions/budget'
import BudgetProgress from './_components/budget-progress'
import DashboardOverview from './_components/transaction-overview'

async function DashBoardPage() {
const accounts = await getUserAccounts();

const defaultAccount = accounts?.find((account) => account.isDefault)

const transactions = await getDashboardData();

let budgetData = null;
if(defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
}
    return <div className='space-y-8'>
        {/*budget progress*/}
        {defaultAccount && (
         <BudgetProgress 
            initialBudget = {budgetData?.budget}
            currentExpenses = {budgetData?.currentExpenses || 0}
        />
        )}

        {/*overview*/}
        <Suspense fallback={"LoadingOverview..."}>
            <DashboardOverview 
            accounts={accounts}
            transactions={transactions || []}
            />

        </Suspense>
        {/*Accounts Grid*/}
        <div className='mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <CreateAccountDrawer>
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                    <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-[180px]">
                       <Plus className='h-10 w-10 mb-2'/>
                       <p className='text-sm font-medium'>Add New Account</p>
                    </CardContent>
                </Card>
            </CreateAccountDrawer>

            {accounts.length>0 && accounts?.map((account,index)=>{
                return<AccountCard key={account.id} account={account} />
                    
            })}
        </div>
    </div>
}

export default DashBoardPage
