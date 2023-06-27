import { Markup } from 'telegraf'

export function actionButtons() {
	return Markup.keyboard(
		[
			Markup.button.callback('🕐 Скільки до кінця пари ?', 'timeToEnd'),
			Markup.button.callback('📋 Розклад', 'schedule'),
			Markup.button.callback('📖 Консультація', 'advice'),
			Markup.button.callback('🔎 Канали Викладачів', 'link')
		],
		{
			columns: 2
		}
	)
}
