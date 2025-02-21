export default function LoadingOverlay() {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg flex items-center gap-3'>
        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600'></div>
        <p className='text-lg font-medium'>Saving Article...</p>
      </div>
    </div>
  );
}
