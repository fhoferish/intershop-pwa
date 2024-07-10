import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { COPILOT_SETTINGS } from 'ish-core/configurations/injection-keys';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { InjectSingle } from 'ish-core/utils/injection';

import { CompareFacade } from '../compare/facades/compare.facade';

import { CopilotFacade } from './facades/copilot.facade';

@Component({
  selector: 'ish-app-copilot',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotComponent implements OnInit, OnDestroy {
  private renderer: Renderer2;
  private destroy$ = new Subject<void>();
  copilotToolCall$: Observable<string>;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(COPILOT_SETTINGS) private copilotSettings: InjectSingle<typeof COPILOT_SETTINGS>,
    private featureToggleService: FeatureToggleService,
    private ngZone: NgZone,
    private router: Router,
    private copilotFacade: CopilotFacade,
    private compareFacade: CompareFacade
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).handleToolCall = this.handleToolCall.bind(this); // Expose handleToolCall globally
  }

  ngOnInit(): void {
    this.initializeCopilot();
    this.copilotToolCall$ = this.copilotFacade.copilotToolCall$;
    this.copilotFacade.setCopilotToolCall('product_search');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleToolCall(toolCall: any) {
    switch (toolCall?.tool) {
      case 'product_search':
        this.navigate(`/search/${toolCall?.toolInput?.Queries}`);
        break;
      case 'product_detail_page':
        this.navigate(`/product/${toolCall?.toolInput?.SKU}`);
        break;
      case 'add_product_to_basket':
        window.location.reload();
        break;
      case 'get_product_variations':
        this.navigate(`/product/${toolCall?.toolInput?.SKU}`);
        break;
      case 'open_basket':
        this.navigate('/basket').then(() => {
          window.location.href = '/basket';
        });
        break;
      case 'compare_products':
        this.handleCompareProducts(toolCall?.toolInput?.SKUs);
        break;
      default:
        break;
    }
  }

  private handleCompareProducts(skuString: string) {
    const newProductIds = skuString.split(';');
    this.compareFacade.compareProducts$
      .pipe(
        take(1), // Take only the first emission and then complete
        takeUntil(this.destroy$)
      )
      .subscribe(currentCompareIds => {
        currentCompareIds.forEach((currentId: string) => {
          this.compareFacade.removeProductFromCompare(currentId);
        });
        newProductIds.forEach((newId: string) => {
          this.compareFacade.toggleProductCompare(newId);
        });
        this.ngZone.run(() => {
          this.router.navigate(['/compare']);
        });
      });
  }

  private navigate(url: string): Promise<boolean> {
    return this.ngZone.run(() => this.router.navigateByUrl(url));
  }

  private initializeCopilot() {
    if (!SSR && this.featureToggleService.enabled('copilot')) {
      const script = this.renderer.createElement('script');
      script.type = 'module';

      script.text = `
        (async () => {
          const { default: Chatbot } = await import("${this.copilotSettings.cdnLink}");
          Chatbot.init({
            chatflowid: "${this.copilotSettings.chatflowid}",
            apiHost: "${this.copilotSettings.apiHost}",
            observersConfig: {
              observeToolCall: toolCall => {
                window.handleToolCall(toolCall); // This will now work
              },
            },
            theme: {
              button: {
                backgroundColor: '#688dc3',
              },
              chatWindow: {
                showTitle: true,
                showAgentMessages: true,
                title: 'inSPIRED Assistant',
                welcomeMessage: 'Welcome! How can I assist you today?',
                backgroundColor: '#f8f9fa',
                height: 700,
                fontSize: 13,
                botMessage: {
                  backgroundColor: '#ffffff',
                },
                userMessage: {
                  backgroundColor: '#688dc3',
                },
                textInput: {
                  sendButtonColor: '#688dc3',
                  maxChars: 50,
                  maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 50 characters.',
                  autoFocus: true,
                },
                footer: {
                  textColor: '#303235',
                  text: 'inSPIRED Assistant uses AI |',
                  company: 'Privacy Policy',
                  companyLink: 'https://intershop.com',
                },
              },
            },
          });
        })();
      `;
      this.renderer.appendChild(this.document.body, script);
    }
  }
}
