export default function DevRoute() {
    return (
        <div className="wallet-ui-debug">
            <pre>{JSON.stringify({ page: 'DEV' }, null, 4)}</pre>
        </div>
    );
}
