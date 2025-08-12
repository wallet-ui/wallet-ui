import { cn } from 'fumadocs-ui/utils/cn';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    packageName: string;
}

export function PackageBadges({ packageName, className, ...props }: ComponentProps) {
    return (
        <div {...props} className={cn('inline-flex items-center gap-2 mx-auto', className)}>
            <a
                className="!p-0 !m-0"
                href={`https://github.com/wallet-ui/wallet-ui/actions/workflows/publish-packages.yml`}
            >
                <img
                    className="!p-0 !m-0"
                    alt=""
                    src={`https://img.shields.io/github/actions/workflow/status/wallet-ui/wallet-ui/publish-packages.yml?logo=GitHub&label=tests`}
                />
            </a>
            <a className="!p-0 !m-0" href={`https://www.npmjs.com/package/${packageName}`}>
                <img
                    alt=""
                    className="!p-0 !m-0"
                    src={`https://img.shields.io/npm/v/${packageName}?logo=npm&color=3F8CD8`}
                />
            </a>
            <a className="!p-0 !m-0" href={`https://www.npmjs.com/package/${packageName}`}>
                <img alt="" className="!p-0 !m-0" src={`https://img.shields.io/npm/dm/${packageName}?color=3F8CD8`} />
            </a>
        </div>
    );
}
