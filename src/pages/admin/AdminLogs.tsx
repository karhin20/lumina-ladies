import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { History, Eye, Filter, RefreshCw, Terminal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AdminLogs = () => {
    const { sessionToken } = useAuth();
    const { toast } = useToast();
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [selectedLog, setSelectedLog] = useState<any>(null);

    const fetchLogs = async () => {
        if (!sessionToken) return;
        setIsLoading(true);
        try {
            const data = await api.getAuditLogs(sessionToken, filter === 'all' ? undefined : filter);
            setLogs(data);
        } catch (error: any) {
            toast({
                title: "Failed to fetch logs",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [sessionToken, filter]);

    const getActionColor = (action: string) => {
        if (action.includes('create')) return 'bg-green-100 text-green-800 border-green-200';
        if (action.includes('delete') || action.includes('deactivate')) return 'bg-red-100 text-red-800 border-red-200';
        if (action.includes('status')) return 'bg-blue-100 text-blue-800 border-blue-200';
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl lg:text-3xl font-semibold">Audit Logs</h1>
                    <p className="text-muted-foreground">Monitor administrative actions across the platform.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>System Activity</CardTitle>
                            <CardDescription>Chronological trail of sensitive changes</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-40 h-9">
                                    <SelectValue placeholder="Resource Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Resources</SelectItem>
                                    <SelectItem value="product">Products</SelectItem>
                                    <SelectItem value="vendor">Vendors</SelectItem>
                                    <SelectItem value="order">Orders</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Resource</TableHead>
                                    <TableHead className="text-right">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <TableRow key={i} className="animate-pulse">
                                            <TableCell colSpan={5} className="h-12 bg-muted/20"></TableCell>
                                        </TableRow>
                                    ))
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            No audit logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/30">
                                            <TableCell className="text-xs font-mono">
                                                {new Date(log.created_at).toLocaleString('en-GB', {
                                                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{log.user_name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase opacity-70">
                                                        {log.user_role?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] py-0 h-5 font-mono ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-[10px] h-5 capitalize">{log.resource_type}</Badge>
                                                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[80px]">
                                                        {log.resource_id?.slice(0, 8)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Log Details
                        </DialogTitle>
                        <DialogDescription>
                            Full data snapshot for this action
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
                            <div>
                                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">User</p>
                                <p className="font-medium mt-1">{selectedLog?.user_name} ({selectedLog?.user_role})</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Timestamp</p>
                                <p className="font-medium mt-1">{selectedLog && new Date(selectedLog.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Action</p>
                                <p className="font-medium mt-1 uppercase text-primary">{selectedLog?.action}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Resource</p>
                                <p className="font-medium mt-1 capitalize">{selectedLog?.resource_type} ({selectedLog?.resource_id})</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Terminal className="w-4 h-4" />
                                <h4 className="text-sm font-bold">Metadata / Changes</h4>
                            </div>
                            <div className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-auto max-h-[300px] font-mono text-xs">
                                <pre>{JSON.stringify(selectedLog?.details, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLogs;
