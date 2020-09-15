import {
	registerVideo,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from '@remotion/core';
import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
	height: 180px;
	position: absolute;
`;

const squircleSize = 200;

const makeSquircle = (w = 100, h = 100, curvature = 0.5): string => {
	const curveWidth = (w / 2) * (1 - curvature);
	const curveHeight = (h / 2) * (1 - curvature);
	return `
        M 0, ${h / 2}
        C 0, ${curveWidth} ${curveHeight}, 0 ${w / 2}, 0
        S ${w}, ${curveHeight} ${w}, ${h / 2}
            ${w - curveWidth}, ${h - 0} ${w / 2}, ${h}
            0, ${w - curveHeight} 0, ${h / 2}
    `;
};

export const Comp: React.FC = () => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();

	const springConfig = {
		damping: 50,
		mass: 1,
		stiffness: 300,
		restSpeedThreshold: 0.00001,
		restDisplacementThreshold: 0.0001,
		fps: videoConfig.fps,
		frame,
		velocity: 0,
	};

	const scale = spring({...springConfig, from: 10, to: 1});
	const logoScale = spring({...springConfig, from: 0, to: 1});
	const squirclefactor = spring({...springConfig, from: 0.2, to: 1.05});

	return (
		<div
			style={{
				flex: 1,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'white',
			}}
		>
			<svg
				viewBox={`0 0 ${squircleSize} ${squircleSize}`}
				style={{
					height: squircleSize,
					width: squircleSize,
					transform: `scale(${scale})`,
				}}
			>
				<path
					d={makeSquircle(squircleSize, squircleSize, squirclefactor)}
					fill="#5851db"
				></path>
			</svg>
			<Logo
				style={{transform: `scale(${logoScale})`}}
				src="https://www.anysticker.app/logo-transparent.png"
			></Logo>
		</div>
	);
};

registerVideo(Comp, {
	fps: 30,
	height: 1080,
	width: 1080,
	durationInFrames: 3 * 30,
});
