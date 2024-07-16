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
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
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

  restEndpoint$: Observable<string>;
  locale = 'en_US';

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(COPILOT_SETTINGS) private copilotSettings: InjectSingle<typeof COPILOT_SETTINGS>,
    private featureToggleService: FeatureToggleService,
    private ngZone: NgZone,
    private router: Router,
    private copilotFacade: CopilotFacade,
    private compareFacade: CompareFacade,
    private shoppingFacade: ShoppingFacade
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).handleToolCall = this.handleToolCall.bind(this); // Expose handleToolCall globally
      this.initializeCopilot();
      this.copilotToolCall$ = this.copilotFacade.copilotToolCall$;
      this.copilotFacade.setCopilotToolCall('product_search');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async handleToolCall(toolCall: any) {
    switch (toolCall?.tool) {
      case 'product_search':
        this.navigate(`/search/${toolCall?.toolInput?.Query}`);
        break;
      case 'product_detail_page':
        this.navigate(`/product/${toolCall?.toolInput?.SKU}`);
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
      case 'add_product_to_basket':
        this.ngZone.run(async () => {
          const skus = toolCall?.toolInput.Products.split(';');
          skus.forEach((sku: string) => {
            console.log(skus);
            this.shoppingFacade.addProductToBasket(sku, 1);
          });
        });
        break;
      default:
        break;
    }
  }

  private async getRestEndpoint() {
    const locale = await this.copilotFacade.getCurrentLocale();
    const currency = await this.copilotFacade.getCurrentCurrency();
    const restEndpoint = await this.copilotFacade.getRestEndpoint();

    // if locale or currency is not available, use defaults en_US and curr=USD
    if (!locale || !currency) {
      return `${restEndpoint};loc=en_US;cur=USD`;
    }

    this.locale = locale;
    return `${restEndpoint};loc=${locale};cur=${currency}`;
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

  private async initializeCopilot() {
    if (!SSR && this.featureToggleService.enabled('copilot')) {
      const customer = await this.copilotFacade.getCustomerState();
      const restEndpoint = await this.getRestEndpoint();
      const script = this.renderer.createElement('script');
      script.type = 'module';

      // create different welcome message based on the locale: en_US, de_DE, fr_FR
      let welcomeMessage = 'Welcome! How can I assist you today?';
      if (this.locale === 'de_DE') {
        welcomeMessage = 'Willkommen! Wie kann ich Ihnen heute helfen?';
      } else if (this.locale === 'fr_FR') {
        welcomeMessage = 'Bienvenue! Comment puis-je vous aider aujourd`hui?';
      }

      script.text = `
        (async () => {
          //const { default: Chatbot } = await import("${this.copilotSettings.cdnLink}");
          const { default: Chatbot } = await import("http://127.0.0.1:8000/dist/web.js");
          Chatbot.init({
            chatflowid: "${this.copilotSettings.chatflowid}",
            apiHost: "${this.copilotSettings.apiHost}",
            chatflowConfig: {
              vars: {
                customer: ${JSON.stringify(customer)},
                restEndpoint: "${restEndpoint}",
                locale: "${this.locale}",
              },
            },
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
                welcomeMessage: '${welcomeMessage}',
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
                  maxChars: 200,
                  maxCharsWarningMessage: 'You exceeded the characters limit. Please input less than 200 characters.',
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
