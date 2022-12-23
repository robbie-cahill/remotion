import React from 'react';
import type {RenderJob} from '../../../preview-server/render-queue/job';
import {FAIL_COLOR, LIGHT_TEXT} from '../../helpers/colors';

const iconStyle: React.CSSProperties = {
	height: 16,
	width: 16,
};

export const RenderQueueItemStatus: React.FC<{
	job: RenderJob;
}> = ({job}) => {
	if (job.status === 'failed') {
		return (
			<div>
				<svg style={iconStyle} viewBox="0 0 512 512">
					<path
						fill={FAIL_COLOR}
						d="M0 160V352L160 512H352L512 352V160L352 0H160L0 160zm353.9 32l-17 17-47 47 47 47 17 17L320 353.9l-17-17-47-47-47 47-17 17L158.1 320l17-17 47-47-47-47-17-17L192 158.1l17 17 47 47 47-47 17-17L353.9 192z"
					/>
				</svg>
			</div>
		);
	}

	if (job.status === 'idle') {
		return (
			<svg style={iconStyle} viewBox="0 0 512 512">
				<path
					fill={LIGHT_TEXT}
					d="M256 512C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"
				/>
			</svg>
		);
	}

	if (job.status === 'done') {
		return (
			<svg style={iconStyle} viewBox="0 0 512 512">
				<path
					fill={LIGHT_TEXT}
					d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337l-17 17-17-17-64-64-17-17L160 222.1l17 17 47 47L335 175l17-17L385.9 192l-17 17z"
				/>
			</svg>
		);
	}

	return <div>{job.status}</div>;
};
