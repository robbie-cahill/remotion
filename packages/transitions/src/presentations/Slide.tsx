import {useState} from 'react';
import {AbsoluteFill, random} from 'remotion';
import type {TransitionPresentation} from '../types';

export const SlideTransition: TransitionPresentation = ({
	children,
	progress,
	direction,
}) => {
	const width = 1;
	const height = 1;
	const [clipId] = useState(() => String(random(null)));

	const progressInDirection = direction === 'in' ? progress : 1 - progress;

	const pathIn = `
	M 0 0
	L ${progressInDirection * width} 0
	L ${progressInDirection * width} ${height}
	L ${0} ${height}
	Z`;

	const pathOut = `
	M ${width} ${height}
	L ${width - progressInDirection * width} ${height}
	L ${width - progressInDirection * width} ${0}
	L ${width} ${0}
	Z
	`;

	const path = direction === 'in' ? pathIn : pathOut;

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					clipPath: `url(#${clipId})`,
				}}
			>
				{children}
			</AbsoluteFill>
			<AbsoluteFill>
				<svg
					viewBox={`0 0 ${width} ${height}`}
					style={{
						width: '100%',
						height: '100%',
					}}
				>
					<defs>
						<clipPath id={clipId} clipPathUnits="objectBoundingBox">
							<path d={path} fill="red" />
						</clipPath>
					</defs>
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
