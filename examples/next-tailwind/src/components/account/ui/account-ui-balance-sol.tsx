export function AccountUiBalanceSol({ balance }: { balance: bigint }) {
    const formattedSolValue = new Intl.NumberFormat(undefined, { maximumFractionDigits: 5 }).format(
        // @ts-expect-error This format string is 100% allowed now.
        `${balance}E-9`
    );

    return <span>{`${formattedSolValue} \u25CE`}</span>;
}