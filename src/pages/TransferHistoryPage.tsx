import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransferHistoryService, { SavedTransfer } from '@/services/transferHistoryService';

type Transfer = {
  id: string;
  recipient: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

// Mock data for transfer history
const transfers: Transfer[] = [
  { id: 'T123456', recipient: 'John Doe', amount: '100.00 USD', date: '2025-06-14', status: 'Completed' },
  { id: 'T123457', recipient: 'Jane Smith', amount: '250.50 EUR', date: '2025-06-12', status: 'Completed' },
  { id: 'T123458', recipient: 'Peter Jones', amount: '50.00 GBP', date: '2025-06-11', status: 'Pending' },
  { id: 'T123459', recipient: 'Maria Garcia', amount: '500.00 MXN', date: '2025-06-10', status: 'Failed' },
  { id: 'T123460', recipient: 'Chen Wei', amount: '1200.00 CNY', date: '2025-06-09', status: 'Completed' },
  { id: 'T123461', recipient: 'David Miller', amount: '75.20 AUD', date: '2025-06-08', status: 'Pending' },
  { id: 'T123462', recipient: 'Sophie Martin', amount: '300.00 CAD', date: '2025-06-07', status: 'Completed' },
  { id: 'T123463', recipient: 'Yuki Tanaka', amount: '15000 JPY', date: '2025-06-06', status: 'Failed' },
];

const getStatusBadgeClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ITEMS_PER_PAGE = 5;

const TransferHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transfer | null; direction: 'ascending' | 'descending' }>({ key: 'date', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  // Load transfers from localStorage on component mount
  useEffect(() => {
    const savedTransfers = TransferHistoryService.getTransferHistory();
    const formattedTransfers: Transfer[] = savedTransfers.map((transfer: SavedTransfer) => ({
      id: transfer.transactionId,
      recipient: transfer.recipient,
      amount: transfer.amount,
      date: transfer.date,
      status: transfer.status
    }));
    setTransfers(formattedTransfers);
  }, []);

  const filteredTransfers = useMemo(() => {
    let filtered = transfers;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase() === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, statusFilter]);

  const sortedTransfers = useMemo(() => {
    let sortableItems = [...filteredTransfers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (sortConfig.key === 'amount') {
            const numA = parseFloat(aValue.split(' ')[0]);
            const numB = parseFloat(bValue.split(' ')[0]);
            if (numA < numB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (numA > numB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransfers, sortConfig]);

  const totalPages = Math.ceil(sortedTransfers.length / ITEMS_PER_PAGE);

  const paginatedTransfers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTransfers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedTransfers, currentPage]);

  const requestSort = (key: keyof Transfer) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 pb-20">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transfer History</h1>
        <p className="text-muted-foreground">
          View and manage your past transfers.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Filter by recipient..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('recipient')}>
                      Recipient <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Button variant="ghost" onClick={() => requestSort('amount')}>
                      Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" onClick={() => requestSort('date')}>
                      Date <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransfers.length > 0 ? (
                  paginatedTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>
                        <div className="font-medium">{transfer.recipient}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {transfer.amount} on {transfer.date}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{transfer.amount}</TableCell>
                      <TableCell className="hidden md:table-cell">{transfer.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={cn('capitalize border-transparent', getStatusBadgeClasses(transfer.status))}>
                          {transfer.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No transfers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4">
           <div className="text-xs text-muted-foreground">
            Showing <strong>{Math.min(1 + (currentPage - 1) * ITEMS_PER_PAGE, sortedTransfers.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedTransfers.length)}</strong> of <strong>{sortedTransfers.length}</strong> transfers
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p-1))}} 
                  className={cn({ 'pointer-events-none opacity-50': currentPage === 1 })}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p+1))}} 
                  className={cn({ 'pointer-events-none opacity-50': currentPage === totalPages })}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransferHistoryPage;
