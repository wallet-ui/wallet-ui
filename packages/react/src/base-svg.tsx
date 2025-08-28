import React from 'react';

export interface BaseSvgProps extends React.DetailedHTMLProps<React.SVGProps<SVGSVGElement>, SVGSVGElement> {
    viewBox: string;
}

export function BaseSvg({ ...props }: BaseSvgProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" {...props}>
            {props.children}
        </svg>
    );
}
