import { memo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Tippy from '@tippyjs/react';
import InvoicePDF from './updatedInvoicepdf';
import IconDownload from './Icon/IconDownload';

const MemoizedPDFDownloadLink = memo(({ invoiceData, invoiceNumber, isLoading, isPDFReady, handleGeneratePDF }) => {
    return (
        <Tippy content="Download Invoice">
            <span>
                {isPDFReady ? (
                    <PDFDownloadLink
                        document={<InvoicePDF invoiceData={invoiceData} />}
                        fileName={`invoice-${invoiceNumber}.pdf`}
                        style={{ textDecoration: 'none', color: '#333' }}
                    >
                        {({ loading }) =>
                            loading ? (
                                <button disabled>
                                    <span className="animate-spin">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            ) : (
                                <button>
                                    <IconDownload />
                                </button>
                            )
                        }
                    </PDFDownloadLink>
                ) : (
                    <button
                        onClick={() => handleGeneratePDF(invoiceData._id)}
                        disabled={isLoading}
                        className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        {isLoading ? (
                            <span className="animate-spin">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v1m0 14v1m8.66-9h-1M4.34 12h-1m15.36 5.36l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7"
                                    />
                                </svg>
                            </span>
                        ) : (
                            <IconDownload />
                        )}
                    </button>
                )}
            </span>
        </Tippy>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.invoiceData._id === nextProps.invoiceData._id &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.isPDFReady === nextProps.isPDFReady
    );
});