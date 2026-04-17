import React, { type ReactNode } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';

type HookComponentProps<Props, Result> = Readonly<{
    hook: (props: Props) => Result;
    hookProps: Props;
    onRender: (result: Result) => void;
}>;

type RenderHookOptions<Props> = Readonly<{
    initialProps: Props;
    wrapper?: (props: { children: ReactNode }) => ReactNode;
}>;

export { act };

export function renderHook<Props, Result>(
    hook: (props: Props) => Result,
    { initialProps, wrapper: Wrapper }: RenderHookOptions<Props>,
) {
    let currentResult!: Result;
    let renderer!: ReactTestRenderer;

    function HookComponent({ hook: currentHook, hookProps, onRender }: HookComponentProps<Props, Result>) {
        onRender(currentHook(hookProps));
        return null;
    }

    function renderNode(hookProps: Props) {
        const node = (
            <HookComponent
                hook={hook}
                hookProps={hookProps}
                onRender={(nextResult: Result) => {
                    currentResult = nextResult;
                }}
            />
        );
        return Wrapper ? <Wrapper>{node}</Wrapper> : node;
    }

    act(() => {
        renderer = create(renderNode(initialProps));
    });

    return {
        rerender(nextProps: Props) {
            act(() => {
                renderer.update(renderNode(nextProps));
            });
        },
        get result() {
            return currentResult;
        },
        unmount() {
            act(() => {
                renderer.unmount();
            });
        },
    };
}
