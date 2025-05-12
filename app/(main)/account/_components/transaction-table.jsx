"use client";


import { bulkDeleteTransactions } from '@/actions/accounts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { categoryColors } from '@/data/categories';
import useFetch from '@/hooks/use-fetch';
import { format } from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, EditIcon, IndianRupeeIcon, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const TransactionTable = ({ transactions, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  })
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [page, setPage] = useState(1);

  const {loading:deleteLoading, fn:deleteFn, data:deleted} = useFetch(bulkDeleteTransactions);

  const selectPageHandler = (selectedPage) => {
    setPage(selectedPage);
  }

  const handleBulkDelete = async () => {
    if(!window.confirm(`Are You sure you want to delete ${selectedIds.length} transactions?`)) {
      return;
    }
  const result = await deleteFn(selectedIds);
  console.log('Bulk Delete Result:', result);  

  if(result.success){ // If the deletion is successful, update the state to remove the deleted transactions
  setSelectedIds([]);
  } else {
    toast.error(result.error || "Failed to delete transactions");
  }
  }
     
  useEffect(() => {
    if(deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully")
    }
  },[deleted, deleteLoading])

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if(searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) => 
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    if(typeFilter) {
      result = result.filter((transaction) => 
        transaction.type.includes(typeFilter)
      );
    }

    if(recurringFilter) {
      result = result.filter((transaction) => {
      if(recurringFilter === "recurring")  return transaction.isRecurring;   
      return !transaction.isRecurring;
    });
    }

    result.sort((a,b)=>{
      let comparision = 0;
      switch (sortConfig.field) {
        case "date":
          comparision = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparision = a.amount-b.amount;
          break;
          case "category":
            comparision = a.category.localeCompare(b.category);
            break;
  
        default:
          comparision=0;
          
      }

      return sortConfig.direction === "asc" ? comparision : -comparision;
    })
    return result;
  }, [
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig,
    page
  ]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length/10);

    const handleSort = (field) => {
      setSortConfig((current)=>({
        field,
        direction:
        current.field==field && current.direction === "asc" ? "desc" : "asc",
      }))
    }

    const handleSelect = (id) => {
      setSelectedIds((current) => current.includes(id)?current.filter(item=>item!==id):[...current,id]);
    };

    const handleSelectAll = () => {
      setSelectedIds((current) => 
        current.length===filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t)=>t.id)
      );

    };

    const handleClearFilters = () => {
      setSearchTerm("");
      setRecurringFilter("");
      setTypeFilter("");
      setSelectedIds([]);
    }

    const RECURRING_INTERVALS = {
      DAILY : "daily",
      WEEKLY : "Weekly",
      MONTHLY: "Monthly",
      YEARLY: "Yearly"
    }

   const router = useRouter();

  return (
    <div className='space-y-4 p-4'>
      {deleteLoading && (
    <BarLoader className='mt-4' width={"100%"} color="#9333ea" /> )}
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
        <Input className="pl-8"
          value={searchTerm}
          placeholder="Search Transactions..."
          onChange={(e)=>setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select className="w-auto min-w-[190px]" value={recurringFilter} onValueChange={(value)=>setRecurringFilter(value)}>
          <SelectTrigger className="min-w-[190px] whitespace-normal">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Recurring Only</SelectItem>
            <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.length>0 && (
        <div>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash className='h-4 w-4'/>
            Delete Selected({selectedIds.length})
          </Button>
          </div>
        )}

        {(searchTerm || typeFilter || recurringFilter) && (
          <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters">
            <X className='h-4 w-5'/>
          </Button>)}
        </div>
      </div>
    </div>
        


        <div className='rounded-md border'>
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox onCheckedChange={handleSelectAll}
        checked={ selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0 } />
      </TableHead>
      <TableHead className="cursor-pointer" onClick={()=>handleSort("date")}>
        <div className='flex items-center'>Date {sortConfig.field==="date" && (sortConfig.direction==="asc"? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>) }</div>
      </TableHead>
      <TableHead>Description</TableHead>
      <TableHead className="cursor-pointer" onClick={()=>handleSort("category")}>
        <div className='flex items-center'>Category {sortConfig.field==="category" && (sortConfig.direction==="asc"? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>) }
        </div>
        </TableHead>
      <TableHead className="cursor-pointer" onClick={()=>handleSort("amount")}>
        <div className='flex items-center justify-end'>Amount {sortConfig.field==="amount" && (sortConfig.direction==="asc"? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>) }
        </div>
        </TableHead>
      <TableHead>Recurring</TableHead>
      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredAndSortedTransactions.length === 0 ? (
      <TableRow>
        <TableCell colSpan={7} className="text-center text-muted-foreground">
          No Transactions Found
        </TableCell>
      </TableRow>
    ) : (
      filteredAndSortedTransactions.slice(page*10-10,page*10).map((transaction)=>(
      <TableRow key={transaction.id}>
        <TableCell><Checkbox onCheckedChange={()=>handleSelect(transaction.id)}
        checked={selectedIds.includes(transaction.id)}
        /></TableCell>
        <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>
        <TableCell>{transaction.description}</TableCell>
        <TableCell className='capitalize'>
          <span style={{
            backgroundColor: categoryColors[transaction.category]
          }} className='rounded-sm py-1 px-2 text-white text-sm'>{transaction.category}</span>
          </TableCell>
        <TableCell className="text-right font-medium" style={{
          color: 
          transaction.type === "EXPENSE" ? "red" : "green",
        }}>
        {transaction.type === "EXPENSE" ? "-" : "+"}
        <IndianRupeeIcon size={15} className='inline-flex'/>
        {transaction.amount.toFixed(2)}
        </TableCell>
        <TableCell>{transaction.isRecurring ? (
          <TooltipProvider>
          <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className="gap-1 p-2 bg-purple-100 text-purple-700 hover:bg-purple-200">
            <RefreshCw className="h-3 w-3" />
            {RECURRING_INTERVALS[transaction.recurringInterval]}
            </Badge>
            </TooltipTrigger>
          <TooltipContent className='bg-black'>
            <div className='text-white text-sm'> 
              <div className='font-medium'>Next Date:</div>
              <div>{format(new Date(transaction.nextRecurringDate),"PP")}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      ) : (
      <Badge variant="outline" className="gap-1 p-2">
        <Clock className="h-3 w-3" />
          One-time
        </Badge>
      )}
  </TableCell>
    <TableCell>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="Ghost" className="h-8 w-8 p-0"><MoreHorizontal className='h-4 w-4'/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}>
          Edit<EditIcon /></DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" 
        onClick={() => deleteFn([transaction.id])}
        >
        Delete<Trash style={{color: "red"}}/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </TableCell>
      </TableRow>
      ))

    ) 
    }
    
    
  </TableBody>
</Table>
</div>
{totalPages > 1 && (
        <div className='flex justify-center items-center gap-4 mt-4'>
          <Button variant='outline' disabled={page === 1} onClick={() => selectPageHandler(page - 1)}>
            <ChevronLeft />
          </Button>
          <span>
            {page} / {totalPages}
          </span>
          <Button variant='outline' disabled={page === totalPages} onClick={() => selectPageHandler(page + 1)}>
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  )
}

export default TransactionTable
