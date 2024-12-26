export default function Dev() {
    return (
        <div>
            <pre>{JSON.stringify({ page: 'DEV' }, null, 4)}</pre>
        </div>
    );
}
