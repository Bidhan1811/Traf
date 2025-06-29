"use client"

import { scanReceipt } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

export const ReceiptScanner = ({onScanComplete}) => {
    const fileInputRef = useRef();

    const {
        loading: scanReceiptLoading,
        fn: scanReceiptFn,
        data: scannedData,
    } = useFetch(scanReceipt);

    const handleReceiptScan = async (file) => {
        if(file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }
    
        await scanReceiptFn(file);
    }

    useEffect(() => {
        if(scannedData && !scanReceiptLoading) {
            onScanComplete(scannedData);
            toast.success('Receipt scanned successfully');
        }
    }, [scannedData, scanReceiptLoading]);

  return (
    <div>
        <input type="file" 
        ref={fileInputRef} 
        accept='image/*' 
        className='hidden' 
        capture='environment'
        onChange={(e) => {
            const file = e.target.files?.[0];
            if(file) handleReceiptScan(file);
        }}
        />
        <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={scanReceiptLoading}
            className='w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white animate-gradient hover:opacity-90 transition-opacity hover:text-white rounded-lg'
        >
            {scanReceiptLoading ?(
            <>
            <Loader2 className='mr-2 animate-spin'/>
            <span>Scanning...</span>
            </>
            ) : (
            <>
            <Camera className='mr-2'/>
            <span>Scan Receipt with AI</span>
            </>
            )}
        </Button>
    </div>
  )
}

