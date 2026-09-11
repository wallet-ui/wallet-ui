/** The runtime caps a transaction at this many compute units. */
const MAX_COMPUTE_UNIT_LIMIT = 1_400_000;
/** Never add fewer than this many compute units on top of an estimate. */
const MIN_COMPUTE_UNIT_BUFFER = 300;
/** Estimates at or above this many compute units get the smallest relative margin. */
const COMPUTE_UNIT_MARGIN_CAP = 500_000;
const MAX_COMPUTE_UNIT_MARGIN = 0.1;
const MIN_COMPUTE_UNIT_MARGIN = 0.02;

/**
 * Turns the compute units a simulation consumed into the compute unit limit to set on the message.
 *
 * Small transactions get a 10% margin, shrinking towards 2% for large ones, with an absolute floor of 300 compute
 * units, and the result never exceeds the runtime maximum. This mirrors the default of `@solana/kit-plugin-rpc`.
 */
export function getComputeUnitLimitFromEstimate(estimatedComputeUnits: number): number {
    const progress = Math.min(estimatedComputeUnits / COMPUTE_UNIT_MARGIN_CAP, 1);
    const margin = MAX_COMPUTE_UNIT_MARGIN - (MAX_COMPUTE_UNIT_MARGIN - MIN_COMPUTE_UNIT_MARGIN) * progress;
    const extraComputeUnits = Math.ceil(estimatedComputeUnits * margin);
    return Math.min(
        MAX_COMPUTE_UNIT_LIMIT,
        estimatedComputeUnits + Math.max(MIN_COMPUTE_UNIT_BUFFER, extraComputeUnits),
    );
}
